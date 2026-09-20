import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, WebWorker } from 'puppeteer-core';
import {
  dispatchOnFixture,
  getBackgroundWorker,
  launchWithExtension,
  openDevpanelAsPage,
  readActionRows,
  readFixtureMessages,
  startFixtureServer,
  type FixtureServer,
  type ResolvedChrome,
} from '../helpers/browser.js';

interface SeenPortMessage {
  portName: string;
  name?: string;
  message?: { type?: string; action?: unknown };
}

declare global {
  // Installed into the service worker global by `observeBackgroundPorts`.
  var __seenPortMessages: SeenPortMessage[] | undefined;
}

/**
 * Adds a second onConnect listener inside the running service worker so the
 * test can see exactly what the background received, without reaching into
 * the background store.
 */
async function observeBackgroundPorts(worker: WebWorker): Promise<void> {
  await worker.evaluate(() => {
    globalThis.__seenPortMessages = [];
    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener(
        (msg: { name?: string; message?: unknown }) => {
          globalThis.__seenPortMessages?.push({
            portName: port.name,
            name: msg.name,
            message: msg.message as SeenPortMessage['message'],
          });
        },
      );
    });
  });
}

async function readSeenPortMessages(
  worker: WebWorker,
): Promise<SeenPortMessage[]> {
  return worker.evaluate(() => globalThis.__seenPortMessages ?? []);
}

describe('Tier 2: extension smoke test (window-port devpanel path)', () => {
  let browser: Browser;
  let chrome: ResolvedChrome;
  let extensionId: string;
  let server: FixtureServer;

  beforeAll(async () => {
    server = await startFixtureServer();
    const launched = await launchWithExtension();
    browser = launched.browser;
    chrome = launched.chrome;
    extensionId = launched.extensionId;
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('reports which Chrome for Testing build is under test', () => {
    // eslint-disable-next-line no-console
    console.log(
      `Chrome ${chrome.channel} ${chrome.buildId} at ${chrome.executablePath}`,
    );
    expect(extensionId).toMatch(/^[a-p]{32}$/);
  });

  it('delivers page actions through content script to the background and panel', async () => {
    const worker = await getBackgroundWorker(browser);
    await observeBackgroundPorts(worker);

    const panel = await openDevpanelAsPage(browser, extensionId);

    const page = await browser.newPage();
    await page.goto(server.url);

    const extensionPresent = await page.evaluate(
      () =>
        (window as unknown as { __fixture: { extensionPresent: boolean } })
          .__fixture.extensionPresent,
    );
    expect(extensionPresent).toBe(true);

    expect(page.mainFrame().extensionRealms().length).toBeGreaterThan(0);

    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'INCREMENT');
    await dispatchOnFixture(page, 'DECREMENT');

    await expect
      .poll(async () => (await readSeenPortMessages(worker)).length, {
        timeout: 10_000,
      })
      .toBeGreaterThanOrEqual(4);

    const seen = await readSeenPortMessages(worker);
    expect(seen.every((m) => m.portName === 'tab')).toBe(true);
    expect(seen[0]?.name).toBe('INIT_INSTANCE');
    const relayedTypes = seen
      .filter((m) => m.name === 'RELAY')
      .map((m) => m.message?.type);
    // pageScript sends STATE for the initial lifted state, then ACTION for the
    // first dispatch. Dispatches inside the 500ms `latency` window are batched
    // into PARTIAL_STATE, so the exact count is timing dependent.
    expect(relayedTypes[0]).toBe('STATE');
    expect(
      relayedTypes.filter((t) => t === 'ACTION' || t === 'PARTIAL_STATE')
        .length,
    ).toBeGreaterThanOrEqual(1);

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
