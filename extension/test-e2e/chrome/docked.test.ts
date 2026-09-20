import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { Browser, Frame, Page } from 'puppeteer-core';
import {
  clickRowButton,
  dispatchOnFixture,
  getBackgroundWorker,
  getDevtoolsPageFor,
  launchWithDockedDevtools,
  readActionRows,
  readFixtureCount,
  readFixtureMessages,
  showReduxPanel,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

/**
 * Docked-panel path: the Redux panel runs inside the real DevTools front-end
 * for the fixture tab, so `chrome.devtools.inspectedWindow.tabId` is set and
 * the panel connects to the background with the `monitor<tabId>` port name.
 * This is the path real users hit; `smoke.test.ts` covers the window-port path.
 */
describe('docked Redux panel inside DevTools', () => {
  let server: FixtureServer;
  let browser: Browser;
  let extensionId: string;
  let page: Page;
  let devtools: Page;
  let panel: Frame;

  beforeAll(async () => {
    server = await startFixtureServer();
    ({ browser, extensionId } = await launchWithDockedDevtools());
    const worker = await getBackgroundWorker(browser);
    await worker.evaluate(() => {
      const seen: string[] = [];
      (globalThis as unknown as { __seenPortNames: string[] }).__seenPortNames =
        seen;
      chrome.runtime.onConnect.addListener((port) => seen.push(port.name));
    });

    // With handleDevToolsAsPage, browser.pages() also returns the DevTools
    // windows, so open a fresh tab rather than reusing the initial one.
    page = await browser.newPage();
    await page.goto(server.url);
    devtools = await getDevtoolsPageFor(browser, page);
    panel = await showReduxPanel(devtools, extensionId);
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  test('panel connects with a tab-scoped monitor port name', async () => {
    const worker = await getBackgroundWorker(browser);
    const names = await waitFor(
      () =>
        worker.evaluate(
          () =>
            (globalThis as unknown as { __seenPortNames: string[] })
              .__seenPortNames,
        ),
      (n) => n.some((name) => /^monitor\d+$/.test(name)),
    );
    expect(names).toContain('tab');
    expect(names.some((name) => /^monitor\d+$/.test(name))).toBe(true);
  });

  test('docked panel shows the actions dispatched on the page', async () => {
    const rows = await waitFor(
      () => readActionRows(panel),
      (r) => r.length === 3,
    );
    expect(rows[0]).toMatch(/@@INIT/);
    expect(rows[1]).toMatch(/INCREMENT/);
    expect(rows[2]).toMatch(/INCREMENT/);
  });

  test('Jump from the docked panel time-travels the page store', async () => {
    await clickRowButton(panel, 1, 'Jump');
    await waitFor(
      () => readFixtureCount(page),
      (count) => count === 1,
    );
    const messages = await readFixtureMessages(page);
    const dispatches = messages.filter((m) => m.type === 'DISPATCH');
    expect(dispatches.at(-1)?.payload).toMatchObject({
      type: 'JUMP_TO_ACTION',
      actionId: 1,
    });
  });
});
