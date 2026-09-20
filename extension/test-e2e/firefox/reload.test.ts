import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  readActionRows,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';
import {
  launchFirefoxWithExtension,
  openFirefoxExtensionPage,
} from '../helpers/firefox.js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Firefox counterpart of chrome/reload.test.ts (#2006 was reported on Firefox). */
describe('Tier 2: Firefox page reload with the panel open', () => {
  let browser: Browser;
  let server: FixtureServer;
  let panel: Page;
  let page: Page;

  beforeAll(async () => {
    server = await startFixtureServer();
    const launched = await launchFirefoxWithExtension();
    browser = launched.browser;
    panel = await openFirefoxExtensionPage(browser, launched.panelUrl);
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
});
