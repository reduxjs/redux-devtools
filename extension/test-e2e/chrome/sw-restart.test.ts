import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  clickRowButton,
  dispatchOnFixture,
  getBackgroundWorker,
  launchWithExtension,
  listServiceWorkerUrls,
  readActionRows,
  readFixtureCount,
  readFixtureMessages,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Terminates the MV3 service worker while a page and a panel are connected.
 * Both the content script and the devpanel reopen their ports with a retry
 * timer (src/utils/reconnectingPort.ts); the content script re-announces its
 * instances and the panel registers as a monitor again, so the page re-sends
 * its full state and the panel repopulates without any reload.
 */
describe('Tier 2: service worker termination and reconnect', () => {
  let browser: Browser;
  let extensionId: string;
  let server: FixtureServer;
  let panel: Page;
  let page: Page;

  beforeAll(async () => {
    server = await startFixtureServer();
    const launched = await launchWithExtension();
    browser = launched.browser;
    extensionId = launched.extensionId;

    panel = await browser.newPage();
    await panel.goto(`chrome-extension://${extensionId}/devpanel.html`);
    page = await browser.newPage();
    await page.goto(server.url);
    await dispatchOnFixture(page, 'INCREMENT');
    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 2,
      {
        timeout: 15_000,
      },
    );
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('worker.close() terminates the background service worker', async () => {
    const worker = await getBackgroundWorker(browser);
    expect(listServiceWorkerUrls(browser)).toHaveLength(1);

    await worker.close();

    await expect
      .poll(() => listServiceWorkerUrls(browser).length, { timeout: 5_000 })
      .toBe(0);
  });

  it('content script reconnects, waking the worker, without telling the page to stop', async () => {
    await expect
      .poll(() => listServiceWorkerUrls(browser).length, { timeout: 10_000 })
      .toBe(1);

    const messages = await readFixtureMessages(page);
    expect(messages.some((m) => m.type === 'STOP' && m.failed === true)).toBe(
      false,
    );
  });

  it('panel repopulates and shows new actions without a page reload', async () => {
    await expect
      .poll(() => readActionRows(panel), { timeout: 15_000 })
      .toHaveLength(2);

    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');

    await expect
      .poll(() => readActionRows(panel), { timeout: 10_000 })
      .toHaveLength(4);
    expect(await readFixtureCount(page)).toBe(3);
  });

  it('panel dispatches still reach the page after the restart', async () => {
    await clickRowButton(panel, 1, 'Jump');
    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(1);
  });

  it('survives a second termination', async () => {
    const worker = await getBackgroundWorker(browser);
    await worker.close();
    await expect
      .poll(() => listServiceWorkerUrls(browser).length, { timeout: 5_000 })
      .toBe(0);
    await expect
      .poll(() => listServiceWorkerUrls(browser).length, { timeout: 10_000 })
      .toBe(1);

    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(() => readActionRows(panel), { timeout: 10_000 })
      .toHaveLength(5);
    await sleep(200);
    expect(
      (await readFixtureMessages(page)).some(
        (m) => m.type === 'STOP' && m.failed === true,
      ),
    ).toBe(false);
  });
});
