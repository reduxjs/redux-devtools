import globals from 'globals';
import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTs from '../../eslint.ts.config.base.mjs';
import eslintTsJest from '../../eslint.ts.jest.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTs(import.meta.dirname),
  ...eslintTsJest(import.meta.dirname),
  {
    ignores: ['dist', 'umd'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
];
