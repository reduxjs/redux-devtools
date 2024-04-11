# Change Log

## 4.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-dock@0.7.0

## 4.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [decc035]
  - @redux-devtools/core@4.0.0

## 3.1.0

### Minor Changes

- 6fc18ed7: Add new Redux version to peer dependencies

### Patch Changes

- 7f5bddbd: Widen peer dependencies

## 3.0.2

### Patch Changes

- 65205f90: Replace Action<unknown> with Action<string>
- Updated dependencies [65205f90]
  - @redux-devtools/core@3.13.2

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
  - react-dock@0.6.0
  - @redux-devtools/core@3.13.0

## 2.1.1

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import DockMonitor from '@redux-devtools/dock-monitor';
+ import { DockMonitor } from '@redux-devtools/dock-monitor';
```

## [1.4.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/dock-monitor@1.3.0...@redux-devtools/dock-monitor@1.4.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 1.3.0 (2021-03-06)

### Features

- **redux-devtools:** convert counter example to TypeScript ([#616](https://github.com/reduxjs/redux-devtools/issues/616)) ([f1e3f4f](https://github.com/reduxjs/redux-devtools/commit/f1e3f4f8340dea288de5229006acf9dc1ef1cccf))
- **redux-devtools-dock-monitor:** convert to TypeScript ([#609](https://github.com/reduxjs/redux-devtools/issues/609)) ([b4ec7f8](https://github.com/reduxjs/redux-devtools/commit/b4ec7f86fc165683bd1e8b5ffc3f0690f670642c))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## [1.2.0](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-dock-monitor@1.1.4...redux-devtools-dock-monitor@1.2.0) (2020-09-07)

### Features

- **redux-devtools:** convert counter example to TypeScript ([#616](https://github.com/reduxjs/redux-devtools/issues/616)) ([f1e3f4f](https://github.com/reduxjs/redux-devtools/commit/f1e3f4f8340dea288de5229006acf9dc1ef1cccf))
- **redux-devtools-dock-monitor:** convert to TypeScript ([#609](https://github.com/reduxjs/redux-devtools/issues/609)) ([b4ec7f8](https://github.com/reduxjs/redux-devtools/commit/b4ec7f86fc165683bd1e8b5ffc3f0690f670642c))
- **redux-devtools-serialize:** convert to TypeScript ([#621](https://github.com/reduxjs/redux-devtools/issues/621)) ([d586f19](https://github.com/reduxjs/redux-devtools/commit/d586f1955a3648883107f8c981ee17eeb4c013a3))

## 1.1.4 (2020-08-14)

**Note:** Version bump only for package redux-devtools-dock-monitor
