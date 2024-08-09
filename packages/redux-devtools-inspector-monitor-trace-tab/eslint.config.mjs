import eslintJs from '../../eslint.js.config.base.mjs';
import eslintTsReact from '../../eslint.ts.react.config.base.mjs';
import eslintTsReactJest from '../../eslint.ts.react.jest.config.base.mjs';

export default [
  ...eslintJs,
  ...eslintTsReact(import.meta.dirname),
  ...eslintTsReactJest(import.meta.dirname),
  {
    ignores: ['lib'],
  },
];
