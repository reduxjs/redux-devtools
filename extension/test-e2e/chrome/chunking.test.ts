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
 * P-1 (#2072): a serialized state over Chrome's 64 MiB port limit must reach
 * the panel through the chunked `split: start / chunk / end` path in both the
 * content script (src/contentScript/index.ts) and the background
 * (src/background/store/apiMiddleware.ts `toMonitors`). The decision to chunk
 * is made from the message size before posting, so it does not depend on the
 * wording of the error Chrome throws, which changed in Chrome 149.
 */
describe('Tier 2: oversized payload / chunking', () => {
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

  it('a state over 64 MiB is chunked and reaches the panel', async () => {
    const before = (await readFixtureMessages(page)).length;
    await dispatchOnFixture(page, 'SET_BIG', { size: 65 * MiB });

    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 60_000,
      })
      .toBe(5);
    expect((await readActionRows(panel))[4]).toContain('SET_BIG');

    const relayed = (await readFixtureMessages(page)).slice(before);
    const outgoing = relayed.find((m) => m.source === '@devtools-page');
    expect(outgoing?.type).toBe('ACTION');
    expect(outgoing?.payload).toMatch(/^<string:\d+>$/);
    const payloadLength = Number(
      String(outgoing?.payload).match(/\d+/)?.[0] ?? 0,
    );
    expect(payloadLength).toBeGreaterThan(64 * MiB);

    // The content script never told the page the connection failed.
    expect(relayed.some((m) => m.type === 'STOP' && m.failed === true)).toBe(
      false,
    );
    expect(listServiceWorkerUrls(browser)).toHaveLength(1);
  });

  it('the page keeps relaying afterwards', async () => {
    await dispatchOnFixture(page, 'CLEAR_BIG');
    await dispatchOnFixture(page, 'INCREMENT');
    await expect
      .poll(async () => (await readActionRows(panel)).length, {
        timeout: 20_000,
      })
      .toBe(7);
    await sleep(500);
    const rows = await readActionRows(panel);
    expect(rows[5]).toContain('CLEAR_BIG');
    expect(rows[6]).toContain('INCREMENT');
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
    // The fallback matcher in src/utils/splitMessage.ts accepts both.
    expect(message).toMatch(/maximum allowed (length|size)/i);
  });
});
