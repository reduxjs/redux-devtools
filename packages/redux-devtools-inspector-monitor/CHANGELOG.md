# Change Log

## 2.1.1

### Patch Changes

- 55cc37e: Fix filter to show state-controlled search value

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import Inspector from '@redux-devtools/inspector-monitor';
+ import { InspectorMonitor } from '@redux-devtools/inspector-monitor';
```

## [1.0.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor@0.15.0...@redux-devtools/inspector-monitor@1.0.0) (2021-06-11)

### Bug Fixes

- **inspector:** fix z-index of tabs ([#723](https://github.com/reduxjs/redux-devtools/issues/723)) ([e747783](https://github.com/reduxjs/redux-devtools/commit/e7477833f05ab0ff8f947a48d97eb3ed87ccb70b))
- **inspector:** move immutable back to dependencies ([#725](https://github.com/reduxjs/redux-devtools/issues/725)) ([fcd73ab](https://github.com/reduxjs/redux-devtools/commit/fcd73ab043062bd3c191fd814f3d912bea6fc675))

## [0.15.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor@0.14.1...@redux-devtools/inspector-monitor@0.15.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 0.14.1 (2021-03-06)

**Note:** Version bump only for package @redux-devtools/inspector-monitor

## [0.14.0](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-inspector@0.13.1...redux-devtools-inspector@0.14.0) (2020-09-07)

### Features

- **redux-devtools-inspector:** convert to TypeScript ([#623](https://github.com/reduxjs/redux-devtools/issues/623)) ([c7b0c7a](https://github.com/reduxjs/redux-devtools/commit/c7b0c7aa6e09f46a36b382ae3ec8e38bd48aeb28))

## [0.13.1](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-inspector@0.13.0...redux-devtools-inspector@0.13.1) (2020-08-14)

**Note:** Version bump only for package redux-devtools-inspector
