# Change Log

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import ChartMonitor from '@redux-devtools/chart-monitor';
+ import { ChartMonitor } from '@redux-devtools/chart-monitor';
```

## [1.9.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/chart-monitor@1.8.0...@redux-devtools/chart-monitor@1.9.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 1.8.0 (2021-03-06)

### Features

- **redux-devtools-chart-monitor:** convert to TypeScript ([#642](https://github.com/reduxjs/redux-devtools/issues/642)) ([761baba](https://github.com/reduxjs/redux-devtools/commit/761baba0aa0f4dc672f8771f4b12bed3863557f7))

## [1.7.2](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-chart-monitor@1.7.1...redux-devtools-chart-monitor@1.7.2) (2020-09-07)

**Note:** Version bump only for package redux-devtools-chart-monitor

## 1.7.1 (2020-08-14)

**Note:** Version bump only for package redux-devtools-chart-monitor
