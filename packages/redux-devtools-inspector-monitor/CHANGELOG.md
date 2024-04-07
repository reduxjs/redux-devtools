# Change Log

## 6.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0
  - react-json-tree@0.19.0

## 6.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [decc035]
  - @redux-devtools/core@4.0.0

## 5.0.1

### Patch Changes

- 3205269: Add explicit return types

## 5.0.0

### Major Changes

- 158ba2c: Replace jss with Emotion in inspector-monitor. `@emotion/react` is now a required peer dependency.

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

- 57751ff9: Add react-dom peerDependency and bump react peerDependency to `^16.8.0 || ^17.0.0 || ^18.0.0`

## 3.1.1

### Patch Changes

- fe32709c: Update jsondiffpatch to fix bundling issues.

## 3.1.0

### Minor Changes

- d54adb76: Option to sort State Tree keys alphabetically
  Option to disable collapsing of object keys

### Patch Changes

- 14a79573: Replace react-dragula with dnd-kit
- bb9bd907: Move @types/redux-devtools-themes to dependencies

## 3.0.2

### Patch Changes

- Updated dependencies [81926f32]
  - react-json-tree@0.18.0

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
  - react-json-tree@0.17.0
  - @redux-devtools/core@3.13.0

## 2.1.2

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

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
