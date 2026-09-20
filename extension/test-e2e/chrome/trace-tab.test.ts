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

const TAB_SELECTOR = '[data-testid="inspector"] div';

async function clickText(panel: Page, selector: string, text: string) {
  const clicked = await panel.$$eval(
    selector,
    (nodes, wanted) => {
      const target = nodes.find((n) => n.textContent?.trim() === wanted);
      if (!(target instanceof HTMLElement)) return false;
      target.click();
      return true;
    },
    text,
  );
  if (!clicked) {
    throw new Error(`No element matching "${text}" for ${selector}`);
  }
}

const panelText = (panel: Page) =>
  panel.evaluate(() => document.body.textContent ?? '');

/**
 * Drilling into an action's JSON tree and then opening the Trace tab used to
 * throw inside the trace tab, unmount the whole panel, and persist the broken
 * inspected path so the panel came back blank on every reload (#1423).
 */
describe('Tier 2: Trace tab after drilling into an action', () => {
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

    panel = await openDevpanelAsPage(browser, extensionId);
    page = await browser.newPage();
    await page.goto(server.url);
    await dispatchOnFixture(page, 'INCREMENT', { by: 1 });
    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 2,
    );
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('keeps the panel alive and shows the trace hint', async () => {
    await panel.$eval('[data-testid="actionListRows"] [data-id="1"]', (row) =>
      (row as HTMLElement).click(),
    );
    await clickText(panel, TAB_SELECTOR, 'Action');
    await expect
      .poll(() => panelText(panel), { timeout: 10_000 })
      .toMatch(/\(pin\)/);
    await clickText(panel, '[data-testid="inspector"] span', '(pin)');

    await clickText(panel, TAB_SELECTOR, 'Trace');

    await expect
      .poll(() => panelText(panel), { timeout: 10_000 })
      .toMatch(/To enable tracing action calls/);
    expect((await readActionRows(panel)).length).toBe(2);
  });

  it('still renders after the panel reloads with the persisted tab', async () => {
    await panel.reload();
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 15_000,
      })
      .toBe(2);
    const text = await panelText(panel);
    expect(text).not.toMatch(/monitor failed to render/);
    expect(text).toMatch(/INCREMENT/);
  });
});
