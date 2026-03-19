import eslintJs from '../../../eslint.js.config.base.mjs';
import eslintTs from '../../../eslint.ts.react.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTs(
    import.meta.dirname,
    ['./src/**/*.ts', './src/**/*.tsx'],
    ['./tsconfig.app.json'],
  ),
  ...eslintTs(
    import.meta.dirname,
    ['vite.config.ts'],
    ['./tsconfig.node.json'],
  ),
  {
    ignores: ['dist'],
  },
];
