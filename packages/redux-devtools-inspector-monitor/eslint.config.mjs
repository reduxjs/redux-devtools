import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTsReact from '../../eslint.ts.react.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTsReact(import.meta.dirname),
  {
    ignores: ['demo', 'lib'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react/no-unknown-property': ['error', { ignore: ['css'] }],
    },
  },
];
