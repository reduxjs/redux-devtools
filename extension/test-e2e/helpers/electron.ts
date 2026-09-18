import { spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, {
  type Browser,
  type Frame,
  type Page,
  type WebWorker,
} from 'puppeteer-core';
import { getBackgroundWorker, showReduxPanel } from './browser.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtureMain = path.resolve(here, '../electron/fixture/main.cjs');

// The `electron` package's CommonJS entry exports the binary path as a string;
// its type declarations describe the runtime API instead, so go through
// `require` to get the string.
const electronPath = createRequire(import.meta.url)('electron') as string;

export interface LaunchedElectron {
  browser: Browser;
  child: ChildProcess;
  extensionId: string;
  worker: WebWorker;
  close: () => Promise<void>;
}

export interface LaunchElectronOptions {
  /**
   * Open the fixture window's DevTools docked at the bottom instead of loading
   * `devpanel.html` in a second window. Use `getDockedReduxPanel` to reach the
   * panel afterwards.
   */
  dockedDevtools?: boolean;
  timeout?: number;
}

/**
 * Starts the Electron fixture app with `--remote-debugging-port=0`, reads the
 * `DevTools listening on ws://...` line Chromium prints to stderr, and connects
 * Puppeteer to that endpoint. Electron does not accept Puppeteer's launch
 * flags, so this bypasses `puppeteer.launch` entirely.
 */
export async function launchElectronWithExtension(
  fixtureUrl: string,
  { dockedDevtools = false, timeout = 30_000 }: LaunchElectronOptions = {},
): Promise<LaunchedElectron> {
  const child = spawn(
    electronPath,
    [fixtureMain, '--remote-debugging-port=0', '--no-sandbox'],
    {
      env: {
        ...process.env,
        E2E_FIXTURE_URL: fixtureUrl,
        E2E_DOCKED_DEVTOOLS: dockedDevtools ? '1' : '0',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  const browserWSEndpoint = await new Promise<string>((resolve, reject) => {
    let stderr = '';
    const timer = setTimeout(() => {
      reject(
        new Error(
          `Electron did not report a DevTools endpoint within ${timeout}ms.\n${stderr}`,
        ),
      );
    }, timeout);
    child.stderr?.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
      const match = /DevTools listening on (ws:\/\/\S+)/.exec(stderr);
      if (match) {
        clearTimeout(timer);
        resolve(match[1]);
      }
    });
    child.on('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Electron exited with code ${code}.\n${stderr}`));
    });
  });

  const browser = await puppeteer.connect({ browserWSEndpoint });
  const worker = await getBackgroundWorker(browser, timeout);
  const extensionId = new URL(worker.url()).hostname;

  const close = async () => {
    await browser.disconnect();
    if (child.exitCode === null) {
      const exited = new Promise<void>((resolve) =>
        child.once('exit', () => resolve()),
      );
      child.kill();
      await exited;
    }
  };

  return { browser, child, extensionId, worker, close };
}

export async function findPageByUrl(
  browser: Browser,
  matches: (url: string) => boolean,
  timeout = 15_000,
): Promise<Page> {
  const target = await browser.waitForTarget(
    (t) => t.type() === 'page' && matches(t.url()),
    { timeout },
  );
  const page = await target.page();
  if (!page) {
    throw new Error(`Target ${target.url()} has no Page handle`);
  }
  return page;
}

/**
 * Finds the docked DevTools front-end that `openDevTools` created for the
 * fixture window, selects the extension's "Redux" tab in it, and returns the
 * `devpanel.html` frame. Electron reports the DevTools WebContents as an
 * ordinary `devtools://` page target over `--remote-debugging-port`, so the
 * same front-end scripting used for Chrome works here.
 */
export async function getDockedReduxPanel(
  browser: Browser,
  extensionId: string,
  timeout = 15_000,
): Promise<Frame> {
  const target = await browser.waitForTarget(
    (t) => t.type() === 'page' && t.url().startsWith('devtools://'),
    { timeout },
  );
  const devtools = await target.page();
  if (!devtools) {
    throw new Error('DevTools target has no Page handle');
  }
  await waitForDevtoolsFrontend(devtools, timeout);
  return showReduxPanel(devtools, extensionId);
}

/**
 * `InspectorView.instance()` throws until the front-end has created its
 * settings storage, which happens a moment after the target appears.
 */
async function waitForDevtoolsFrontend(
  devtools: Page,
  timeout: number,
): Promise<void> {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const ready = await devtools
      .evaluate(`(async () => {
        const UI = await import('./ui/legacy/legacy.js');
        UI.InspectorView.InspectorView.instance();
        return true;
      })()`)
      .catch(() => false);
    if (ready === true) return;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`DevTools front-end did not initialize within ${timeout}ms`);
}
