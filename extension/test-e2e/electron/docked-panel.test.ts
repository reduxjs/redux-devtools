import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Frame, Page } from 'puppeteer-core';
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
  getDockedReduxPanel,
  launchElectronWithExtension,
  type LaunchedElectron,
} from '../helpers/electron.js';

/**
 * The extension's panel running inside Electron's docked DevTools, i.e. the
 * `chrome.devtools.panels` path rather than `devpanel.html` opened as a plain
 * window. This is how users of Electron apps actually see the panel.
 */
describe('Electron docked DevTools panel', () => {
  let server: FixtureServer;
  let electron: LaunchedElectron;
  let page: Page;
  let panel: Frame;

  beforeAll(async () => {
    server = await startFixtureServer();
    electron = await launchElectronWithExtension(server.url, {
      dockedDevtools: true,
    });
    page = await findPageByUrl(electron.browser, (url) =>
      url.startsWith(server.url),
    );
    panel = await getDockedReduxPanel(electron.browser, electron.extensionId);
  });

  afterAll(async () => {
    await electron?.close();
    await server?.close();
  });

  it('renders the Redux panel inside the devtools:// frontend', async () => {
    expect(panel.url()).toBe(
      `chrome-extension://${electron.extensionId}/devpanel.html`,
    );
    expect(panel.parentFrame()?.url()).toMatch(/^devtools:\/\//);
  });

  it('lists @@INIT and a dispatched action in the docked panel', async () => {
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 15_000,
      })
      .toBe(2);
    const rows = await readActionRows(panel);
    expect(rows[0]).toContain('@@INIT');
    expect(rows[1]).toContain('INCREMENT');
  });

  it('Jump from the docked panel changes the page store', async () => {
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 10_000,
      })
      .toBe(3);
    expect(await readFixtureCount(page)).toBe(2);
    await clickRowButton(panel, 1, 'Jump');
    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(1);
  });
});
