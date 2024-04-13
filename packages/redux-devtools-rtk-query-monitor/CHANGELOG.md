# Change Log

## 5.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0
  - react-json-tree@0.19.0
  - @redux-devtools/ui@1.3.2

## 5.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [decc035]
  - @redux-devtools/core@4.0.0

## 4.0.1

### Patch Changes

- 3205269: Add explicit return types

## 4.0.0

### Major Changes

- 6954eb9: Replace jss with Emotion in inspector-monitor. `@emotion/react` is now a required peer dependency.

## 3.2.0

### Minor Changes

- 7f5bddbd: Widen peer dependencies
- 6fc18ed7: Add new Redux version to peer dependencies

### Patch Changes

- Updated dependencies [7f5bddbd]
  - @redux-devtools/ui@1.3.1

## 3.1.2

### Patch Changes

- 42531c50: Bump versions
- Updated dependencies [42531c50]
  - @redux-devtools/core@3.13.3

## 3.1.1

### Patch Changes

- Updated dependencies [81926f32]
  - react-json-tree@0.18.0

## 3.1.0

### Minor Changes

- 24f60a7a: feat(rtk-query): add Data tab to rtk-query-monitor #1126 #1129

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
  - @redux-devtools/ui@1.3.0
  - @redux-devtools/core@3.13.0

## 2.1.2

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import RtkQueryrMonitor from '@redux-devtools/rtk-query-monitor';
+ import { RtkQueryrMonitor } from '@redux-devtools/rtk-query-monitor';
```
