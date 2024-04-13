# Change Log

## 5.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0
  - react-json-tree@0.19.0

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

## 4.0.3

### Patch Changes

- 42531c50: Bump versions
- Updated dependencies [42531c50]
  - @redux-devtools/core@3.13.3

## 4.0.2

### Patch Changes

- Updated dependencies [81926f32]
  - react-json-tree@0.18.0

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
  - react-json-tree@0.17.0
  - @redux-devtools/core@3.13.0

## 3.1.1

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

## 3.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import LogMonitor from '@redux-devtools/log-monitor';
+ import { LogMonitor } from '@redux-devtools/log-monitor';
```

## [2.3.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/log-monitor@2.2.0...@redux-devtools/log-monitor@2.3.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 2.2.0 (2021-03-06)

### Bug Fixes

- **cli:** resolve dependency issues ([#666](https://github.com/reduxjs/redux-devtools/issues/666)) ([e39e439](https://github.com/reduxjs/redux-devtools/commit/e39e43968b445ecbdcdab515050c5338cadabbe6))
- **redux-devtools-log-monitor:** update react-json-tree dependency ([#533](https://github.com/reduxjs/redux-devtools/issues/533)) ([5f00930](https://github.com/reduxjs/redux-devtools/commit/5f00930eef78de97aa4a477d054801f93add6070))

### Features

- **d3-state-visualizer:** convert to TypeScript ([#640](https://github.com/reduxjs/redux-devtools/issues/640)) ([0c78a5a](https://github.com/reduxjs/redux-devtools/commit/0c78a5a9a76ee7eff37dcd8e39272d98c03e0869))
- **redux-devtools:** convert counter example to TypeScript ([#616](https://github.com/reduxjs/redux-devtools/issues/616)) ([f1e3f4f](https://github.com/reduxjs/redux-devtools/commit/f1e3f4f8340dea288de5229006acf9dc1ef1cccf))
- **redux-devtools-log-monitor:** convert to TypeScript ([#613](https://github.com/reduxjs/redux-devtools/issues/613)) ([2faa163](https://github.com/reduxjs/redux-devtools/commit/2faa16319b59ece946757af7630ca4ab1264f1f5))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))
- **redux-devtools-slider-monitor:** convert to TypeScript ([#631](https://github.com/reduxjs/redux-devtools/issues/631)) ([8991732](https://github.com/reduxjs/redux-devtools/commit/89917320e5ecf33dc3625b05daa1e9fe120a783d))

## [2.1.0](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-log-monitor@2.0.1...redux-devtools-log-monitor@2.1.0) (2020-09-07)

### Features

- **redux-devtools:** convert counter example to TypeScript ([#616](https://github.com/reduxjs/redux-devtools/issues/616)) ([f1e3f4f](https://github.com/reduxjs/redux-devtools/commit/f1e3f4f8340dea288de5229006acf9dc1ef1cccf))
- **redux-devtools-log-monitor:** convert to TypeScript ([#613](https://github.com/reduxjs/redux-devtools/issues/613)) ([2faa163](https://github.com/reduxjs/redux-devtools/commit/2faa16319b59ece946757af7630ca4ab1264f1f5))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## [2.0.1](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-log-monitor@2.0.0...redux-devtools-log-monitor@2.0.1) (2020-08-14)

**Note:** Version bump only for package redux-devtools-log-monitor
