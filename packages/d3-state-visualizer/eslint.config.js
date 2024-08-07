import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTs from '../../eslint.ts.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTs(import.meta.dirname),
  {
    ignores: ['examples', 'lib'],
  },
];
