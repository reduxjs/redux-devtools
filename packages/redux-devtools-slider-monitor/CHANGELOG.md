# Change Log

## 5.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0
  - @redux-devtools/ui@1.3.2

## 5.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [decc035]
  - @redux-devtools/core@4.0.0

## 4.1.0

### Minor Changes

- 6fc18ed7: Add new Redux version to peer dependencies

### Patch Changes

- 7f5bddbd: Widen peer dependencies
- Updated dependencies [7f5bddbd]
  - @redux-devtools/ui@1.3.1

## 4.0.2

### Patch Changes

- 42531c50: Bump versions
- Updated dependencies [42531c50]
  - @redux-devtools/core@3.13.3

## 4.0.1

### Patch Changes

- a55ba302: Fix peer dependencies on @redux-devtools/core
- Updated dependencies [a55ba302]
  - @redux-devtools/core@3.13.1

## 4.0.0

### Minor Changes

- 8a7eae4: Add React 18 to peerDependencies range

### Patch Changes

- Updated dependencies [8a7eae4]
  - @redux-devtools/ui@1.3.0
  - @redux-devtools/core@3.13.0

## 3.1.2

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

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
