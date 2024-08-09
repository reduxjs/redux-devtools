import eslintJs from '../../../eslint.js.config.base.mjs';
import eslintTs from '../../../eslint.ts.react.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTs(import.meta.dirname),
  ...eslintTs(
    import.meta.dirname,
    ['webpack.config.ts'],
    ['./tsconfig.webpack.json'],
  ),
  {
    ignores: ['dist'],
  },
];
