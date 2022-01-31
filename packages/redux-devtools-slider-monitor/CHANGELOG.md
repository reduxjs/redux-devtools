# Change Log

## 3.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import SliderMonitor from '@redux-devtools/slider-monitor';
+ import { SliderMonitor } from '@redux-devtools/slider-monitor';
```

## [2.0.0-8](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/slider-monitor@2.0.0-7...@redux-devtools/slider-monitor@2.0.0-8) (2021-06-11)

**Note:** Version bump only for package @redux-devtools/slider-monitor

## [2.0.0-7](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/slider-monitor@2.0.0-6...@redux-devtools/slider-monitor@2.0.0-7) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 2.0.0-6 (2021-03-06)

### Features

- **redux-devtools-slider-monitor:** convert example to TypeScript ([#632](https://github.com/reduxjs/redux-devtools/issues/632)) ([ec75d3a](https://github.com/reduxjs/redux-devtools/commit/ec75d3a4b62d0f4b8d52a739a7727142421cc261))
- **redux-devtools-slider-monitor:** convert to TypeScript ([#631](https://github.com/reduxjs/redux-devtools/issues/631)) ([8991732](https://github.com/reduxjs/redux-devtools/commit/89917320e5ecf33dc3625b05daa1e9fe120a783d))

## [2.0.0-5](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-slider-monitor@2.0.0-4...redux-devtools-slider-monitor@2.0.0-5) (2020-09-07)

**Note:** Version bump only for package redux-devtools-slider-monitor

## 2.0.0-4 (2020-08-14)

**Note:** Version bump only for package redux-devtools-slider-monitor
