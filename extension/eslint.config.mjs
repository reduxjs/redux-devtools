import globals from 'globals';
import eslintJs from '../eslint.js.config.base.mjs';
import eslintTsReact from '../eslint.ts.react.config.base.mjs';
import eslintJsReactJest from '../eslint.js.react.jest.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTsReact(import.meta.dirname),
  ...eslintJsReactJest,
  {
    ignores: [
      'chrome',
      'dist',
      'edge',
      'examples',
      'firefox',
      'test/electron/fixture/dist',
    ],
  },
  {
    files: ['build.mjs'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
  {
    files: ['test/**/*.js', 'test/**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        EUI: true,
      },
    },
  },
];
