import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  launchWithExtension,
  openDevpanelAsPage,
  readActionRows,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Reloading the inspected page tears down the old content script port and
 * opens a new one under the same tab id. The old port's `onDisconnect` may
 * arrive after the new page has already started sending actions; the
 * background must not treat that as the new page going away (#2006).
 */
describe('Tier 2: page reload with the panel open', () => {
  let browser: Browser;
  let server: FixtureServer;
  let panel: Page;
  let page: Page;

  beforeAll(async () => {
    server = await startFixtureServer();
    const launched = await launchWithExtension();
    browser = launched.browser;
    panel = await openDevpanelAsPage(browser, launched.extensionId);
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

  it('actions dispatched right after a reload stay in the panel', async () => {
    await page.reload();
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');

    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 3,
      {
        timeout: 15_000,
      },
    );

    await sleep(2_000);
    const rows = await readActionRows(panel);
    expect(rows).toHaveLength(3);
    expect(rows.filter((r) => /INCREMENT/.test(r))).toHaveLength(2);
  });

  it('a second reload behaves the same way', async () => {
    await page.reload();
    await dispatchOnFixture(page, 'INCREMENT');

    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 2,
      {
        timeout: 15_000,
      },
    );
    await sleep(2_000);
    expect(await readActionRows(panel)).toHaveLength(2);
  });
});
