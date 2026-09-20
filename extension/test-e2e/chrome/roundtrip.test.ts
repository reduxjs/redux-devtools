import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  clickRowButton,
  dispatchOnFixture,
  launchWithExtension,
  openDevpanelAsPage,
  readActionRows,
  readFixtureCount,
  readFixtureMessages,
  startFixtureServer,
  type FixtureServer,
} from '../helpers/browser.js';

const RELAY_LATENCY_MS = 500;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface LiftedDispatchPayload {
  type?: string;
  actionId?: number;
  id?: number;
}

/**
 * Panel -> background -> content script -> page. Clicking a row's Jump or
 * Skip button sends a lifted DISPATCH through the whole chain and must change
 * the state the page's real store reports.
 */
describe('Tier 2: panel to page round trip', () => {
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

    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('shows the three dispatched actions and count 3 before any panel input', async () => {
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 15_000,
      })
      .toBe(4);
    expect(await readFixtureCount(page)).toBe(3);
  });

  it('Jump on the first INCREMENT rewinds the page store to count 1', async () => {
    await clickRowButton(panel, 1, 'Jump');

    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(1);

    const dispatches = (await readFixtureMessages(page))
      .filter((m) => m.type === 'DISPATCH')
      .map((m) => m.payload as LiftedDispatchPayload);
    expect(dispatches.at(-1)?.type).toBe('JUMP_TO_ACTION');
    expect(dispatches.at(-1)?.actionId).toBe(1);
  });

  it('Jump on the last action restores count 3', async () => {
    await clickRowButton(panel, 3, 'Jump');
    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(3);
  });

  it('Skip on the second INCREMENT recomputes the page store to count 2', async () => {
    await clickRowButton(panel, 2, 'Skip');
    await expect
      .poll(() => readFixtureCount(page), { timeout: 10_000 })
      .toBe(2);

    const dispatches = (await readFixtureMessages(page))
      .filter((m) => m.type === 'DISPATCH')
      .map((m) => m.payload as LiftedDispatchPayload);
    expect(dispatches.at(-1)?.type).toBe('TOGGLE_ACTION');
    expect(dispatches.at(-1)?.id).toBe(2);
  });

  it('a new page dispatch after panel edits builds on the recomputed state', async () => {
    // Let pageScript's 500ms `relayState` throttle drain first so this test
    // measures the plain path; the next test covers the overlapping case.
    await sleep(RELAY_LATENCY_MS + 200);
    await dispatchOnFixture(page, 'DECREMENT');
    expect(await readFixtureCount(page)).toBe(1);
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 10_000,
      })
      .toBe(5);
    const rows = await readActionRows(panel);
    expect(rows[4]).toContain('DECREMENT');
  });

  /**
   * `relayState` (pageScript/index.ts) is a lodash throttle. Two monitor
   * actions inside the 500ms window make the second one fire on the trailing
   * edge, and that trailing call also runs `relayAction.cancel()`. The
   * trailing STATE must be built from the store at invoke time, so a page
   * action dispatched in between is kept rather than overwritten by a stale
   * snapshot.
   */
  it('two quick panel edits then a page dispatch keep the new action in the panel', async () => {
    await sleep(RELAY_LATENCY_MS + 200);
    const countBefore = await readFixtureCount(page);
    const rowsBefore = (await readActionRows(panel)).length;
    expect(rowsBefore).toBe(5);

    const togglesBefore = (await readFixtureMessages(page)).filter(
      (m) =>
        (m.payload as LiftedDispatchPayload | undefined)?.type ===
        'TOGGLE_ACTION',
    ).length;
    await clickRowButton(panel, 2, 'Skip'); // un-skip
    await clickRowButton(panel, 2, 'Skip'); // re-skip, within the throttle window
    // Both TOGGLE_ACTIONs must reach the page before the page dispatches, or
    // the second toggle can arrive after DECREMENT and mask the defect.
    await expect
      .poll(
        async () =>
          (await readFixtureMessages(page)).filter(
            (m) =>
              (m.payload as LiftedDispatchPayload | undefined)?.type ===
              'TOGGLE_ACTION',
          ).length,
        { timeout: 2_000, interval: 10 },
      )
      .toBe(togglesBefore + 2);
    await dispatchOnFixture(page, 'DECREMENT');
    expect(await readFixtureCount(page)).toBe(countBefore - 1);

    await sleep(RELAY_LATENCY_MS + 500);

    const stateMessages = (await readFixtureMessages(page)).filter(
      (m) => m.type === 'STATE',
    );
    const lastState = stateMessages.at(-1)?.payload as
      | { nextActionId?: number }
      | undefined;
    const storeNextActionId = await page.evaluate(() => {
      const win = window as unknown as {
        __fixture: {
          store: { liftedStore: { getState: () => { nextActionId: number } } };
        };
      };
      return win.__fixture.store.liftedStore.getState().nextActionId;
    });
    expect(storeNextActionId).toBe(6);
    expect(lastState?.nextActionId).toBe(6);
    expect((await readActionRows(panel)).length).toBe(6);
  });
});
