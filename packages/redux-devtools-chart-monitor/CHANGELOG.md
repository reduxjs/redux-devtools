# Change Log

## 5.0.2

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0

## 5.0.1

### Patch Changes

- Updated dependencies [191d419]
  - d3-state-visualizer@3.0.0

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

## 4.0.1

### Patch Changes

- 65205f90: Replace Action<unknown> with Action<string>
- Updated dependencies [65205f90]
  - @redux-devtools/core@3.13.2

## 4.0.0

### Major Changes

- b323f77d: Upgrade D3

  - Split `style` option into `chartStyles`, `nodeStyleOptions`, `textStyleOptions`, and `linkStyles`.
  - The shape of the argument passed to the `onClickText` option has been updated.

### Patch Changes

- Updated dependencies [b323f77d]
  - d3-state-visualizer@2.0.0

## 3.0.1

### Patch Changes

- a55ba302: Fix peer dependencies on @redux-devtools/core
- Updated dependencies [a55ba302]
  - @redux-devtools/core@3.13.1

## 3.0.0

### Minor Changes

- 8a7eae4: Add React 18 to peerDependencies range

### Patch Changes

- Updated dependencies [8a7eae4]
  - @redux-devtools/core@3.13.0

## 2.1.1

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

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
