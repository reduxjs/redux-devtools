import { spawn, type ChildProcess } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer, {
  type Browser,
  type Page,
  type WebWorker,
} from 'puppeteer-core';
import { getBackgroundWorker } from './browser.js';

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

/**
 * Starts the Electron fixture app with `--remote-debugging-port=0`, reads the
 * `DevTools listening on ws://...` line Chromium prints to stderr, and connects
 * Puppeteer to that endpoint. Electron does not accept Puppeteer's launch
 * flags, so this bypasses `puppeteer.launch` entirely.
 */
export async function launchElectronWithExtension(
  fixtureUrl: string,
  timeout = 30_000,
): Promise<LaunchedElectron> {
  const child = spawn(
    electronPath,
    [fixtureMain, '--remote-debugging-port=0', '--no-sandbox'],
    {
      env: { ...process.env, E2E_FIXTURE_URL: fixtureUrl },
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
