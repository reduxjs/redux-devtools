# Change Log

## 0.4.2

### Patch Changes

- 7f5bddbd: Widen peer dependencies

## 0.4.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import Serialize from '@redux-devtools/serialize';
+ import { immutable } from '@redux-devtools/serialize';
```

## 0.3.0 (2021-03-06)

### Features

- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## 0.2.0 (2020-09-07)

### Features

- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## 0.1.9 (2020-08-14)

**Note:** Version bump only for package remotedev-serialize
