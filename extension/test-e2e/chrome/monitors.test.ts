import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import type { Browser, Frame, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  getDevtoolsPageFor,
  launchWithDockedDevtools,
  readActionRows,
  selectMonitor,
  showReduxPanel,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

/**
 * Switching between the Inspector, Log, and Chart monitors inside the docked
 * panel. Each monitor is a separate package, so this checks that all three
 * mount against a live store and that the toolbar's collapsible tabs work in a
 * panel-sized viewport.
 */
describe('monitor switching in the docked panel', () => {
  let server: FixtureServer;
  let browser: Browser;
  let extensionId: string;
  let page: Page;
  let panel: Frame;

  const panelText = () => panel.evaluate(() => document.body.textContent ?? '');
  const hasActionList = () =>
    panel.$('[data-testid="actionListRows"]').then((el) => el !== null);

  beforeAll(async () => {
    server = await startFixtureServer();
    ({ browser, extensionId } = await launchWithDockedDevtools());
    page = await browser.newPage();
    await page.goto(server.url);
    const devtools = await getDevtoolsPageFor(browser, page);
    panel = await showReduxPanel(devtools, extensionId);
    await dispatchOnFixture(page, 'INCREMENT');
    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 2,
    );
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  test('switches to the Log monitor', async () => {
    await selectMonitor(panel, 'LogMonitor');
    await waitFor(hasActionList, (present) => !present);
    const text = await waitFor(panelText, (t) => /INCREMENT/.test(t));
    expect(text).toMatch(/state/);
  });

  test('switches to the Chart monitor', async () => {
    await selectMonitor(panel, 'ChartMonitor');
    const rootLabel = await waitFor(
      () =>
        panel.$$eval('.nodeText', (nodes) =>
          nodes.map((n) => n.textContent ?? ''),
        ),
      (labels) => labels.includes('state'),
    );
    expect(rootLabel).toContain('state');
  });

  test('switches back to the Inspector monitor', async () => {
    await selectMonitor(panel, 'InspectorMonitor');
    const rows = await waitFor(
      () => readActionRows(panel),
      (r) => r.length === 2,
    );
    expect(rows[0]).toMatch(/@@INIT/);
    expect(rows[1]).toMatch(/INCREMENT/);
  });
});
