import { existsSync } from 'node:fs';
import path from 'node:path';
import {
  defineConfig,
  type Plugin,
  type TestProjectConfiguration,
} from 'vitest/config';

interface ProjectOptions {
  environment?: 'jsdom' | 'node';
  setupFiles?: string[];
  testTimeout?: number;
  include?: string[];
  env?: Record<string, string>;
}

function project(
  name: string,
  dir: string,
  {
    environment = 'node',
    setupFiles,
    testTimeout,
    include = ['test/**/*.{spec,test}.?(c|m)[jt]s?(x)'],
    env,
  }: ProjectOptions = {},
): TestProjectConfiguration {
  return {
    root: path.resolve(import.meta.dirname, dir),
    test: {
      name,
      globals: true,
      environment,
      include,
      setupFiles,
      testTimeout,
      env,
    },
  };
}

/**
 * Plain `.js`/`.jsx` test files in `extension/test` import TypeScript sources
 * with a `.js` extension. Vite only rewrites `.js` -> `.ts` when the importer
 * is itself a TypeScript file, so handle the JS-importer case here.
 */
function resolveTsFromJsImporter(): Plugin {
  return {
    name: 'resolve-ts-from-js-importer',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!importer || !source.startsWith('.') || !/\.jsx?$/.test(source)) {
        return null;
      }
      if (/\.[cm]?tsx?$/.test(importer)) return null;
      const target = path.resolve(path.dirname(importer), source);
      if (existsSync(target)) return null;
      const base = target.replace(/\.jsx?$/, '');
      for (const ext of ['.ts', '.tsx']) {
        if (existsSync(base + ext)) return base + ext;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [resolveTsFromJsImporter()],
  test: {
    projects: [
      project('map2tree', 'packages/map2tree'),
      project('react-base16-styling', 'packages/react-base16-styling'),
      project('react-json-tree', 'packages/react-json-tree'),
      project('core', 'packages/redux-devtools'),
      project('app-core', 'packages/redux-devtools-app-core', {
        environment: 'jsdom',
        setupFiles: ['test/setup.ts'],
      }),
      project('cli', 'packages/redux-devtools-cli', { testTimeout: 10000 }),
      project(
        'test-tab',
        'packages/redux-devtools-inspector-monitor-test-tab',
        {
          environment: 'jsdom',
        },
      ),
      project(
        'trace-tab',
        'packages/redux-devtools-inspector-monitor-trace-tab',
        { environment: 'jsdom' },
      ),
      project('instrument', 'packages/redux-devtools-instrument'),
      project(
        'rtk-query-monitor',
        'packages/redux-devtools-rtk-query-monitor',
        {
          environment: 'jsdom',
        },
      ),
      project('extension-types', 'packages/redux-devtools-extension'),
      project('serialize', 'packages/redux-devtools-serialize'),
      project('ui', 'packages/redux-devtools-ui', { environment: 'jsdom' }),
      project('utils', 'packages/redux-devtools-utils'),
      project('remote', 'packages/redux-devtools-remote'),
      project('extension', 'extension', {
        environment: 'jsdom',
        setupFiles: ['test/setup.ts'],
        include: ['test/app/**/*.spec.?(c|m)[jt]s?(x)'],
        testTimeout: 50000,
        env: { BABEL_ENV: 'test' },
      }),
      project('extension-harness', 'extension', {
        environment: 'jsdom',
        include: ['test-harness/**/*.test.?(c|m)[jt]s?(x)'],
      }),
    ],
  },
});
