import globals from 'globals';
import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTs from '../../eslint.ts.config.base.mjs';
import eslintTsJest from '../../eslint.ts.jest.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTs,
  ...eslintTsJest,
  {
    ignores: ['dist', 'jest.config.ts', 'umd'],
  },
  {
    languageOptions: {
      globals: {
        ...globals.nodeBuiltin,
      },
    },
  },
];
