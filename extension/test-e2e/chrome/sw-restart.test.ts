import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  getBackgroundWorker,
  launchWithExtension,
  listServiceWorkerUrls,
  readFixtureMessages,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function readActionRows(panel: Page): Promise<string[]> {
  return panel.$$eval('[data-testid="actionListRows"] > *', (rows) =>
    rows.map((r) => r.textContent ?? '').filter((text) => /Jump/.test(text)),
  );
}

/**
 * Documents what happens today when the MV3 service worker is terminated
 * while a page and a panel are connected. The content script has no reconnect
 * logic (`handleDisconnect` in src/contentScript/index.ts) and the devpanel
 * never listens for `onDisconnect` (src/devpanel/index.tsx), so both sides go
 * silent. These assertions pin the current, broken behavior; flip them when
 * reconnect support lands.
 */
describe('Tier 2: service worker termination (current behavior)', () => {
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

  it('content script tells the page the connection failed and stops relaying', async () => {
    await expect
      .poll(
        async () =>
          (await readFixtureMessages(page)).some(
            (m) => m.type === 'STOP' && m.failed === true,
          ),
        { timeout: 5_000 },
      )
      .toBe(true);

    const before = (await readFixtureMessages(page)).length;
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
    await sleep(1_000);

    // The STOP message flips the pageScript monitor to inactive, so it stops
    // posting to window entirely. The content script listener is gone too, and
    // no port reconnect happens, so the service worker is never woken back up.
    const after = await readFixtureMessages(page);
    expect(after.length).toBe(before);
    expect(listServiceWorkerUrls(browser)).toHaveLength(0);
  });

  it('panel keeps the stale action list and never recovers', async () => {
    await sleep(1_000);
    expect(await readActionRows(panel)).toHaveLength(2);

    // A page reload creates a fresh content script, which reconnects and wakes
    // the service worker. The already-open panel still holds its dead port.
    await page.reload();
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(() => listServiceWorkerUrls(browser).length, { timeout: 10_000 })
      .toBe(1);
    await sleep(1_500);

    expect(await readActionRows(panel)).toHaveLength(2);

    // Only a freshly opened panel sees the new instance.
    const freshPanel = await browser.newPage();
    await freshPanel.goto(`chrome-extension://${extensionId}/devpanel.html`);
    await expect
      .poll(async () => (await readActionRows(freshPanel)).length, {
        timeout: 15_000,
      })
      .toBe(2);
    await freshPanel.close();
  });
});
