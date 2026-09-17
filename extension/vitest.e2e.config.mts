import { defineConfig, type TestProjectConfiguration } from 'vitest/config';

/**
 * End-to-end suites that drive a real browser or Electron against the built
 * extension in `dist/`. They need a browser binary and, for some files, a
 * display (xvfb in CI), so they are kept out of the root `vitest.config.mts`
 * and run via the `test:e2e:*` and `test:electron` scripts.
 *
 * - `e2e-chrome`: Puppeteer against Chrome for Testing. Set `CHROME_CHANNEL`
 *   (stable | beta | dev | canary) to pick a channel, or `CHROME_PATH` to use an
 *   existing binary. Downloads into the Puppeteer cache on first use.
 * - `e2e-firefox`: Puppeteer over WebDriver BiDi against Firefox. Set
 *   `FIREFOX_CHANNEL` or `FIREFOX_PATH`. See `test-e2e/helpers/firefox.ts` for
 *   the Windows cache-path caveat.
 * - `extension-electron`: the legacy Electron docked-panel suite.
 */
function e2eProject(
  name: string,
  include: string[],
  timeout = 60_000,
): TestProjectConfiguration {
  return {
    test: {
      name,
      globals: true,
      environment: 'node',
      include,
      testTimeout: timeout,
      hookTimeout: timeout * 2,
    },
  };
}

export default defineConfig({
  test: {
    fileParallelism: false,
    projects: [
      e2eProject('e2e-chrome', ['test-e2e/chrome/**/*.test.?(c|m)[jt]s?(x)']),
      e2eProject('e2e-firefox', ['test-e2e/firefox/**/*.test.?(c|m)[jt]s?(x)']),
      e2eProject(
        'extension-chrome',
        ['test/chrome/**/*.spec.?(c|m)[jt]s?(x)'],
        50_000,
      ),
      e2eProject(
        'extension-electron',
        ['test/electron/**/*.spec.?(c|m)[jt]s?(x)'],
        50_000,
      ),
    ],
  },
});
