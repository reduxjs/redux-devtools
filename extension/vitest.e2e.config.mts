import { defineConfig } from 'vitest/config';

/**
 * Selenium (Chrome) and Electron end-to-end suites. These need a built
 * extension in `dist/`, a browser, and a display (xvfb in CI), so they are
 * kept out of the root `vitest.config.mts` and run via `test:chrome` and
 * `test:electron`.
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    testTimeout: 50000,
    hookTimeout: 50000,
    fileParallelism: false,
    projects: [
      {
        test: {
          name: 'extension-chrome',
          globals: true,
          include: ['test/chrome/**/*.spec.?(c|m)[jt]s?(x)'],
          testTimeout: 50000,
          hookTimeout: 50000,
        },
      },
      {
        test: {
          name: 'extension-electron',
          globals: true,
          include: ['test/electron/**/*.spec.?(c|m)[jt]s?(x)'],
          testTimeout: 50000,
          hookTimeout: 50000,
        },
      },
    ],
  },
});
