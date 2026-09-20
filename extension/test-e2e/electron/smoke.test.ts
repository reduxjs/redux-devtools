import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  clickRowButton,
  dispatchOnFixture,
  readActionRows,
  readFixtureCount,
  startFixtureServer,
  type FixtureServer,
} from '../helpers/browser.js';
import {
  findPageByUrl,
  launchElectronWithExtension,
  type LaunchedElectron,
} from '../helpers/electron.js';

/**
 * The extension loaded into an Electron host via `session.loadExtension`.
 * Electron lacks several `chrome.*` APIs the MV3 background worker touches
 * (`chrome.action`, `chrome.commands`, `chrome.contextMenus`, ...), which
 * `src/chromeApiMock.ts` stubs. This suite exists to catch that integration
 * breaking on an Electron or Chromium bump (see reduxjs/redux-devtools#1730).
 */
describe('Electron host', () => {
  let server: FixtureServer;
  let electron: LaunchedElectron;
  let browser: Browser;
  let page: Page;
  let panel: Page;

  beforeAll(async () => {
    server = await startFixtureServer();
    electron = await launchElectronWithExtension(server.url);
    browser = electron.browser;
    page = await findPageByUrl(browser, (url) => url.startsWith(server.url));
    panel = await findPageByUrl(browser, (url) =>
      url.startsWith(
        `chrome-extension://${electron.extensionId}/devpanel.html`,
      ),
    );
  });

  afterAll(async () => {
    await electron?.close();
    await server?.close();
  });

  it('registers the background service worker under an Electron user agent', async () => {
    expect(electron.extensionId).toMatch(/^[a-p]{32}$/);
    const userAgent = await electron.worker.evaluate(() => navigator.userAgent);
    expect(userAgent).toContain('Electron');
  });

  it('injects the page script so the fixture connects to the extension', async () => {
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const win = window as unknown as {
              __fixture?: { extensionPresent: boolean };
            };
            return win.__fixture?.extensionPresent ?? null;
          }),
        { timeout: 10_000 },
      )
      .toBe(true);
  });

  it('lists @@INIT and a dispatched action in the panel', async () => {
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 15_000,
      })
      .toBe(2);
    const rows = await readActionRows(panel);
    expect(rows[0]).toContain('@@INIT');
    expect(rows[1]).toContain('INCREMENT');
    expect(await readFixtureCount(page)).toBe(1);
  });

  it('Jump from the panel changes the page store', async () => {
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 10_000,
      })
      .toBe(3);
    await clickRowButton(panel, 1, 'Jump');
    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(1);
  });
});
