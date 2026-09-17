import {
  Browser as BrowserName,
  ChromeReleaseChannel,
  detectBrowserPlatform,
  install,
  resolveBuildId,
} from '@puppeteer/browsers';
import puppeteer, {
  type Browser,
  type Frame,
  type LaunchOptions,
  type Page,
  type WebWorker,
} from 'puppeteer-core';
import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
export const extensionDistDir = path.resolve(here, '../../dist');
const fixtureDir = path.resolve(here, '../fixture');

const channelFromEnv = (): ChromeReleaseChannel => {
  const raw = process.env.CHROME_CHANNEL ?? 'stable';
  const channel = Object.values(ChromeReleaseChannel).find((c) => c === raw);
  if (!channel) {
    throw new Error(`Unsupported CHROME_CHANNEL "${raw}"`);
  }
  return channel;
};

export interface ResolvedChrome {
  channel: ChromeReleaseChannel;
  buildId: string;
  executablePath: string;
}

/**
 * Resolves and (if needed) downloads Chrome for Testing for the requested
 * channel into the shared puppeteer cache directory. `CHROME_PATH` short
 * circuits the download so CI can point at a browser installed by
 * `browser-actions/setup-chrome`.
 */
export async function resolveChrome(): Promise<ResolvedChrome> {
  const channel = channelFromEnv();
  if (process.env.CHROME_PATH) {
    return {
      channel,
      buildId: process.env.CHROME_BUILD_ID ?? 'unknown',
      executablePath: process.env.CHROME_PATH,
    };
  }
  const platform = detectBrowserPlatform();
  if (!platform) {
    throw new Error('Could not detect browser platform');
  }
  const cacheDir =
    process.env.PUPPETEER_CACHE_DIR ??
    path.join(os.homedir(), '.cache', 'puppeteer');
  const buildId = await resolveBuildId(BrowserName.CHROME, platform, channel);
  const installed = await install({
    browser: BrowserName.CHROME,
    buildId,
    cacheDir,
    platform,
  });
  return { channel, buildId, executablePath: installed.executablePath };
}

export interface FixtureServer {
  url: string;
  close: () => Promise<void>;
}

/**
 * Content scripts do not run on file:// pages unless the user toggles
 * "Allow access to file URLs", so the fixture is served over http.
 */
export async function startFixtureServer(): Promise<FixtureServer> {
  const reduxEsm = path.resolve(
    here,
    '../../node_modules/redux/dist/redux.mjs',
  );
  const server: Server = createServer((req, res) => {
    const urlPath = req.url === '/' ? '/index.html' : (req.url ?? '/');
    const filePath =
      urlPath === '/redux.mjs' ? reduxEsm : path.join(fixtureDir, urlPath);
    readFile(filePath).then(
      (body) => {
        res.writeHead(200, {
          'content-type': urlPath.endsWith('.html')
            ? 'text/html; charset=utf-8'
            : urlPath.endsWith('.mjs')
              ? 'text/javascript; charset=utf-8'
              : 'application/octet-stream',
        });
        res.end(body);
      },
      () => {
        res.writeHead(404);
        res.end();
      },
    );
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}/`,
    close: () =>
      new Promise<void>((resolve, reject) =>
        server.close((err) => (err ? reject(err) : resolve())),
      ),
  };
}

export interface LaunchedExtension {
  browser: Browser;
  chrome: ResolvedChrome;
  extensionId: string;
}

export async function launchWithExtension(
  extra: Partial<LaunchOptions> = {},
): Promise<LaunchedExtension> {
  const chrome = await resolveChrome();
  const browser = await puppeteer.launch({
    executablePath: chrome.executablePath,
    headless: process.env.HEADFUL ? false : true,
    enableExtensions: [extensionDistDir],
    ...extra,
  });
  const worker = await getBackgroundWorker(browser);
  const extensionId = new URL(worker.url()).hostname;
  return { browser, chrome, extensionId };
}

export async function getBackgroundWorker(
  browser: Browser,
  timeout = 15_000,
): Promise<WebWorker> {
  const target = await browser.waitForTarget(
    (t) =>
      t.type() === 'service_worker' && t.url().endsWith('background.bundle.js'),
    { timeout },
  );
  const worker = await target.worker();
  if (!worker) {
    throw new Error('Service worker target has no WebWorker handle');
  }
  return worker;
}

export function listServiceWorkerUrls(browser: Browser): string[] {
  return browser
    .targets()
    .filter((t) => t.type() === 'service_worker')
    .map((t) => t.url());
}

export async function waitFor<T>(
  read: () => Promise<T> | T,
  predicate: (value: T) => boolean,
  { timeout = 10_000, interval = 100 } = {},
): Promise<T> {
  const deadline = Date.now() + timeout;
  let last = await read();
  while (!predicate(last)) {
    if (Date.now() > deadline) {
      throw new Error(
        `waitFor timed out after ${timeout}ms; last value: ${JSON.stringify(last)}`,
      );
    }
    await new Promise((r) => setTimeout(r, interval));
    last = await read();
  }
  return last;
}

export interface FixtureMessage {
  source?: string;
  type?: string;
  instanceId?: number;
  failed?: boolean;
  payload?: unknown;
}

export async function readFixtureMessages(
  page: Page,
): Promise<FixtureMessage[]> {
  return page.evaluate(() => {
    const win = window as unknown as { __messages: FixtureMessage[] };
    return win.__messages;
  });
}

export async function readFixtureCount(page: Page): Promise<number> {
  return page.evaluate(() => {
    const win = window as unknown as {
      __fixture: { store: { getState: () => { count: number } } };
    };
    return win.__fixture.store.getState().count;
  });
}

export async function openDevpanelAsPage(
  browser: Browser,
  extensionId: string,
): Promise<Page> {
  const page = await browser.newPage();
  await page.goto(`chrome-extension://${extensionId}/devpanel.html`);
  return page;
}

/**
 * Launches with a DevTools window auto-opened for every tab and exposes the
 * DevTools front-end as a Puppeteer Page (`handleDevToolsAsPage`). This is
 * the only way to drive the docked-panel path (`chrome.devtools.*` APIs).
 * Chrome forces headful for this mode.
 */
export async function launchWithDockedDevtools(): Promise<LaunchedExtension> {
  return launchWithExtension({ devtools: true, handleDevToolsAsPage: true });
}

/**
 * Finds the DevTools front-end page that inspects `inspected`. Each tab gets
 * its own `devtools://devtools/bundled/devtools_app.html` target; the one we
 * want is the one whose main frame's `InspectorFrontendHost` is attached to
 * our tab, which we detect by asking the front-end for its inspected URL.
 */
export async function getDevtoolsPageFor(
  browser: Browser,
  inspected: Page,
  timeout = 15_000,
): Promise<Page> {
  const inspectedUrl = inspected.url();
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const targets = browser
      .targets()
      .filter((t) => t.url().startsWith('devtools://'));
    for (const target of targets) {
      const dtPage = await target.page();
      if (!dtPage) continue;
      const url = await dtPage
        .evaluate(
          `(async () => {
          const SDK = await import('./core/sdk/sdk.js');
          const target = SDK.TargetManager.TargetManager.instance().primaryPageTarget();
          return target ? target.inspectedURL() : '';
        })()`,
        )
        .catch(() => '');
      if (url === inspectedUrl) return dtPage;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`No DevTools page found inspecting ${inspectedUrl}`);
}

export const reduxPanelTabId = (extensionId: string) =>
  `chrome-extension://${extensionId}Redux`;

/**
 * Selects the extension's "Redux" panel tab in the DevTools front-end and
 * returns the `devpanel.html` frame it renders into. The panel iframe is only
 * created on first selection.
 */
export async function showReduxPanel(
  devtools: Page,
  extensionId: string,
): Promise<Frame> {
  const tabId = reduxPanelTabId(extensionId);
  await waitFor(
    () =>
      devtools.evaluate(`(async () => {
        const UI = await import('./ui/legacy/legacy.js');
        return UI.InspectorView.InspectorView.instance().hasPanel(${JSON.stringify(tabId)});
      })()`),
    (has) => has === true,
  );
  await devtools.evaluate(`(async () => {
    const UI = await import('./ui/legacy/legacy.js');
    await UI.InspectorView.InspectorView.instance().showPanel(${JSON.stringify(tabId)});
  })()`);
  return waitFor(
    () =>
      devtools
        .frames()
        .find((f) =>
          f.url().startsWith(`chrome-extension://${extensionId}/devpanel.html`),
        ),
    (frame) => frame !== undefined,
  ) as Promise<Frame>;
}

export async function readActionRows(panel: Page | Frame): Promise<string[]> {
  await panel.waitForSelector('[data-testid="actionListRows"]', {
    timeout: 10_000,
  });
  // The row container also holds dnd-kit's hidden accessibility nodes; real
  // rows have no testid of their own, so filter to the ones with row buttons.
  return panel.$$eval('[data-testid="actionListRows"] > *', (rows) =>
    rows.map((r) => r.textContent ?? '').filter((text) => /Jump/.test(text)),
  );
}

/**
 * Clicks the "Jump" or "Skip" button of the row for `actionId`. The buttons
 * are only slid into view on hover, so this dispatches a DOM click directly
 * rather than going through Puppeteer's visibility checks.
 */
export async function clickRowButton(
  panel: Page | Frame,
  actionId: number,
  button: 'Jump' | 'Skip',
): Promise<void> {
  const clicked = await panel.$$eval(
    `[data-testid="actionListRows"] [data-id="${actionId}"] [data-isselectorbutton]`,
    (buttons, label) => {
      const target = buttons.find((b) => b.textContent === label);
      if (!(target instanceof HTMLElement)) return false;
      target.click();
      return true;
    },
    button,
  );
  if (!clicked) {
    throw new Error(`No "${button}" button found for action ${actionId}`);
  }
}

export async function dispatchOnFixture(
  page: Page,
  type: string,
  fields: Record<string, number | string | boolean> = {},
): Promise<void> {
  await page.evaluate(
    (actionType, extra) => {
      const win = window as unknown as {
        __fixture: { store: { dispatch: (a: { type: string }) => void } };
      };
      win.__fixture.store.dispatch({ ...extra, type: actionType });
    },
    type,
    fields,
  );
}

/**
 * Posts an oversized message on a throwaway port from the content-script realm
 * and returns the error Chrome throws. This is the string the chunking
 * fallback in src/contentScript/index.ts matches on, so tests can record what
 * the current Chrome build actually says. The port is named so the background
 * treats it as a monitor; call this only after the assertions that depend on
 * monitor count.
 */
export async function probePortSizeLimitError(
  page: Page,
  bytes: number,
): Promise<string> {
  const [realm] = page.mainFrame().extensionRealms();
  if (!realm) throw new Error('No content-script realm on the fixture page');
  return realm.evaluate((size) => {
    const port = chrome.runtime.connect({ name: 'size-probe' });
    try {
      port.postMessage({ probe: 'x'.repeat(size) });
      return 'no error thrown';
    } catch (err) {
      return err instanceof Error ? err.message : String(err);
    } finally {
      port.disconnect();
    }
  }, bytes);
}
