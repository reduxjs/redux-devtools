import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  readActionRows,
  readFixtureMessages,
  startFixtureServer,
  type FixtureServer,
} from '../helpers/browser.js';
import {
  geckoId,
  launchFirefoxWithExtension,
  openFirefoxExtensionPage,
  type ResolvedFirefox,
} from '../helpers/firefox.js';

/**
 * Firefox has no service worker target to inspect (the MV3 build uses an
 * event page), so this smoke test asserts end to end through the window-port
 * devpanel path only: page -> content script -> background -> panel page.
 */
describe('Tier 2: Firefox smoke test (WebDriver BiDi)', () => {
  let browser: Browser;
  let firefox: ResolvedFirefox;
  let extensionId: string;
  let panelUrl: string;
  let server: FixtureServer;

  beforeAll(async () => {
    server = await startFixtureServer();
    const launched = await launchFirefoxWithExtension();
    browser = launched.browser;
    firefox = launched.firefox;
    extensionId = launched.extensionId;
    panelUrl = launched.panelUrl;
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('installs the unpacked firefox/dist build as a temporary add-on', () => {
    // eslint-disable-next-line no-console
    console.log(
      `Firefox ${firefox.channel} ${firefox.buildId} at ${firefox.executablePath}`,
    );
    expect(extensionId).toBe(geckoId);
  });

  it('delivers page actions to a devpanel opened as a page', async () => {
    const panel: Page = await openFirefoxExtensionPage(browser, panelUrl);

    const page = await browser.newPage();
    await page.goto(server.url);

    const extensionPresent = await page.evaluate(
      () =>
        (window as unknown as { __fixture: { extensionPresent: boolean } })
          .__fixture.extensionPresent,
    );
    expect(extensionPresent).toBe(true);

    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'DECREMENT');

    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 15_000,
      })
      .toBe(4);
    const rows = await readActionRows(panel);
    expect(rows[0]).toContain('@@INIT');
    expect(rows[1]).toContain('INCREMENT');
    expect(rows[3]).toContain('DECREMENT');

    const pageMessages = await readFixtureMessages(page);
    expect(pageMessages.some((m) => m.type === 'OPTIONS')).toBe(true);

    await page.close();
    await panel.close();
  });
});
