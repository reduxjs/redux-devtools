import globals from 'globals';
import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTsReact from '../../eslint.ts.react.config.base.mjs';
import eslintTsReactJest from '../../eslint.ts.react.jest.config.base.mjs';
import eslintTs from '../../eslint.ts.react.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTsReact(import.meta.dirname),
  ...eslintTsReact(
    import.meta.dirname,
    ['demo/**/*.ts', 'demo/**/*.tsx'],
    ['./tsconfig.demo.json'],
  ),
  ...eslintTsReactJest(import.meta.dirname),
  ...eslintTs(
    import.meta.dirname,
    ['webpack.config.ts', 'webpack.config.umd.ts'],
    ['./tsconfig.webpack.json'],
  ),
  {
    ignores: ['build', 'lib', 'umd'],
  },
  {
    files: ['buildUmd.mjs'],
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
];
