# Change Log

## 2.2.0

### Minor Changes

- 6fc18ed7: Add new Redux version to peer dependencies

## 2.1.2

### Patch Changes

- 262ea85c: Remove unnecessary exported functions from instrument

## 2.1.1

### Patch Changes

- 42531c50: Bump versions

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import instrument from '@redux-devtools/instrument';
+ import { instrument } from '@redux-devtools/instrument';
```

## 1.11.0 (2021-03-06)

### Features

- **instrument:** use latest symbol-observable (compatibility with frozen Symbol) ([#660](https://github.com/reduxjs/redux-devtools/issues/660)) ([4d73c3f](https://github.com/reduxjs/redux-devtools/commit/4d73c3f98cb9e3308a1e888213ca4faaec9f1b5e))
- **redux-devtools-instrument:** export type PerformAction ([#614](https://github.com/reduxjs/redux-devtools/issues/614)) ([9e59cfd](https://github.com/reduxjs/redux-devtools/commit/9e59cfdc7d1d0595f0718feaebc0a9bf814b0b63))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## [1.10.0](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-instrument@1.9.7...redux-devtools-instrument@1.10.0) (2020-09-07)

### Features

- **redux-devtools-instrument:** export type PerformAction ([#614](https://github.com/reduxjs/redux-devtools/issues/614)) ([9e59cfd](https://github.com/reduxjs/redux-devtools/commit/9e59cfdc7d1d0595f0718feaebc0a9bf814b0b63))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## 1.9.7 (2020-08-14)

**Note:** Version bump only for package redux-devtools-instrument
