import {
  Browser as BrowserName,
  detectBrowserPlatform,
  install,
  resolveBuildId,
} from '@puppeteer/browsers';
import puppeteer, { type Browser, type Page } from 'puppeteer-core';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { waitFor } from './browser.js';

const here = path.dirname(fileURLToPath(import.meta.url));
export const firefoxDistDir = path.resolve(here, '../../firefox/dist');

/** `browser_specific_settings.gecko.id` from firefox/manifest.json. */
export const geckoId = 'extension@redux.devtools';

/**
 * Firefox assigns a random internal UUID per install, and that UUID is what
 * `moz-extension://` URLs use. Pinning it through the
 * `extensions.webextensions.uuids` pref makes `moz-extension://<uuid>/devpanel.html`
 * predictable.
 */
export const pinnedUuid = '7f1c8a4e-2d2b-4a7b-9f4b-0d1e2c3b4a59';

export interface ResolvedFirefox {
  channel: string;
  buildId: string;
  executablePath: string;
}

export async function resolveFirefox(): Promise<ResolvedFirefox> {
  const channel = process.env.FIREFOX_CHANNEL ?? 'stable';
  if (process.env.FIREFOX_PATH) {
    return {
      channel,
      buildId: process.env.FIREFOX_BUILD_ID ?? 'unknown',
      executablePath: process.env.FIREFOX_PATH,
    };
  }
  const platform = detectBrowserPlatform();
  if (!platform) {
    throw new Error('Could not detect browser platform');
  }
  const cacheDir =
    process.env.FIREFOX_CACHE_DIR ??
    process.env.PUPPETEER_CACHE_DIR ??
    path.join(os.homedir(), '.cache', 'puppeteer');
  if (process.platform === 'win32' && cacheDir.includes(' ')) {
    // @puppeteer/browsers extracts Firefox on Windows by running the NSIS
    // installer with `/ExtractDir=<dir>`. A space in <dir> breaks NSIS argument
    // parsing and the installer falls back to its interactive GUI, which then
    // installs Firefox system-wide.
    throw new Error(
      `Firefox cache dir "${cacheDir}" contains a space; set FIREFOX_CACHE_DIR to a path without spaces`,
    );
  }
  const buildId = await resolveBuildId(BrowserName.FIREFOX, platform, channel);
  const installed = await install({
    browser: BrowserName.FIREFOX,
    buildId,
    cacheDir,
    platform,
  });
  return { channel, buildId, executablePath: installed.executablePath };
}

/**
 * Opens an extension page in a new tab. The document loads fine, but BiDi
 * never emits a navigation-complete for privileged moz-extension:// loads,
 * so `page.goto` would hang until its timeout. Kick off the navigation
 * without awaiting it, then wait for the document to be in place.
 */
export async function openFirefoxExtensionPage(
  browser: Browser,
  url: string,
): Promise<Page> {
  const page = await browser.newPage();
  void page.goto(url, { timeout: 60_000 }).catch(() => undefined);
  await waitFor(
    () =>
      page
        .evaluate(() => `${location.href}|${document.readyState}`)
        .catch(() => ''),
    (state) => state === `${url}|complete`,
    { timeout: 15_000, interval: 100 },
  );
  return page;
}

export interface LaunchedFirefoxExtension {
  browser: Browser;
  firefox: ResolvedFirefox;
  extensionId: string;
  panelUrl: string;
}

/**
 * Launches Firefox over WebDriver BiDi and installs the unpacked firefox/dist
 * build as a temporary add-on via `webExtension.install`.
 */
export async function launchFirefoxWithExtension(): Promise<LaunchedFirefoxExtension> {
  const firefox = await resolveFirefox();
  const browser = await puppeteer.launch({
    browser: 'firefox',
    executablePath: firefox.executablePath,
    headless: !process.env.HEADFUL,
    // Without this, WebDriver BiDi rejects `browsingContext.navigate` to
    // moz-extension:// URLs with "not allowed in this context".
    args: ['--remote-allow-system-access'],
    extraPrefsFirefox: {
      'extensions.webextensions.uuids': JSON.stringify({
        [geckoId]: pinnedUuid,
      }),
    },
  });
  const extensionId = await browser.installExtension(firefoxDistDir);
  return {
    browser,
    firefox,
    extensionId,
    panelUrl: `moz-extension://${pinnedUuid}/devpanel.html`,
  };
}
