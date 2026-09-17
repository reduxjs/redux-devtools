import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Browser, Page } from 'puppeteer-core';
import {
  dispatchOnFixture,
  launchWithExtension,
  listServiceWorkerUrls,
  openDevpanelAsPage,
  probePortSizeLimitError,
  readActionRows,
  readFixtureMessages,
  startFixtureServer,
  waitFor,
  type FixtureServer,
} from '../helpers/browser.js';

const MiB = 1024 * 1024;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * P-1: the content script only chunks when `port.postMessage` throws the exact
 * string 'Message length exceeded maximum allowed length.'
 * (src/contentScript/index.ts, tryCatch). Chrome >= 149 throws a different
 * message, so any state whose serialized form is over the 64 MiB port limit
 * takes the generic error branch and the connection is dropped instead.
 *
 * These tests pin the current behavior and record the error string of the
 * Chrome build under test. Flip the "current behavior" assertions when
 * chunking is fixed.
 */
describe('Tier 2: oversized payload / chunking (current behavior)', () => {
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
    await waitFor(
      () => readActionRows(panel),
      (rows) => rows.length === 2,
      { timeout: 15_000 },
    );
  });

  afterAll(async () => {
    await browser?.close();
    await server?.close();
  });

  it('a state just under the port limit reaches the panel unchunked', async () => {
    // 20 MiB serialized is well under both the real 64 MiB port limit and the
    // extension's own 32 MiB chunk size, so this must always work.
    await dispatchOnFixture(page, 'SET_BIG', { size: 20 * MiB });
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 20_000,
      })
      .toBe(3);
    await dispatchOnFixture(page, 'CLEAR_BIG');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 20_000,
      })
      .toBe(4);
  });

  it('a state over 64 MiB drops the connection instead of chunking (P-1)', async () => {
    const before = (await readFixtureMessages(page)).length;
    await dispatchOnFixture(page, 'SET_BIG', { size: 65 * MiB });

    // The pageScript relays the action after its 500ms throttle; the content
    // script's postMessage then throws, the error string does not match, and
    // handleDisconnect posts STOP { failed: true } back to the page.
    await expect
      .poll(
        async () =>
          (await readFixtureMessages(page))
            .slice(before)
            .some((m) => m.type === 'STOP' && m.failed === true),
        { timeout: 10_000 },
      )
      .toBe(true);

    const relayed = (await readFixtureMessages(page)).slice(before);
    const outgoing = relayed.find((m) => m.source === '@devtools-page');
    expect(outgoing?.type).toBe('ACTION');
    expect(outgoing?.payload).toMatch(/^<string:\d+>$/);
    const payloadLength = Number(
      String(outgoing?.payload).match(/\d+/)?.[0] ?? 0,
    );
    expect(payloadLength).toBeGreaterThan(64 * MiB);

    // No chunked re-send happened: nothing after the ACTION except STOP.
    expect(
      relayed.filter((m) => m.source === '@devtools-page').map((m) => m.type),
    ).toEqual(['ACTION']);

    await sleep(1_000);
    expect(await readActionRows(panel)).toHaveLength(4);
    expect(listServiceWorkerUrls(browser)).toHaveLength(1);
  });

  it('the page is dead to the extension afterwards', async () => {
    const before = (await readFixtureMessages(page)).length;
    await dispatchOnFixture(page, 'CLEAR_BIG');
    await dispatchOnFixture(page, 'INCREMENT');
    await sleep(1_000);
    expect((await readFixtureMessages(page)).length).toBe(before);
    expect(await readActionRows(panel)).toHaveLength(4);
  });

  it('records the size-limit error string Chrome throws on this build', async () => {
    const version = await browser.version();
    const message = await probePortSizeLimitError(page, 65 * MiB);
    // eslint-disable-next-line no-console
    console.log(
      `[chunking] ${version}: port.postMessage(65 MiB) -> "${message}"`,
    );

    expect(message).not.toBe('no error thrown');
    // Pre-149 Chrome: 'Message length exceeded maximum allowed length.'
    // Chrome >= 149: 'Message exceeded maximum allowed size of 64MiB.'
    expect(message).toMatch(/maximum allowed (length|size)/i);
    // Current code only handles the old wording. This assertion fails on
    // Chrome < 149; on any current build it documents the P-1 mismatch.
    expect(message).not.toBe('Message length exceeded maximum allowed length.');
  });
});
