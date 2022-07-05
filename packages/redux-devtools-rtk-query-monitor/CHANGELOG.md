# Change Log

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
