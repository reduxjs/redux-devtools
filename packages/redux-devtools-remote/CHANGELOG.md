# Change Log

## 0.9.3

### Patch Changes

- f387854: Revert "Add polyfill for Symbol.asyncIterator (#1642)"

## 0.9.2

### Patch Changes

- 138f4f3: Fix Hermes support by adding polyfill for Symbol.asyncIterator

## 0.9.1

### Patch Changes

- @redux-devtools/utils@3.0.0

## 0.9.0

### Minor Changes

- 6fc18ed7: Add new Redux version to peer dependencies

### Patch Changes

- Updated dependencies [7f5bddbd]
- Updated dependencies [6fc18ed7]
  - @redux-devtools/utils@2.1.0
  - @redux-devtools/instrument@2.2.0

## 0.8.2

### Patch Changes

- 42531c50: Bump versions
- Updated dependencies [42531c50]
  - @redux-devtools/instrument@2.1.1
  - @redux-devtools/utils@2.0.2

## 0.8.1

### Patch Changes

- 7e6d0438: Transform `for await...of` syntax for @redux-devtools/remote to support Hermes Engine

## 0.8.0

### Minor Changes

- 421ea476: Upgrade SocketCluster (#1167)

## 0.7.5

### Patch Changes

- @redux-devtools/utils@2.0.0

## 0.7.4

### Patch Changes

- @redux-devtools/utils@1.2.1

## 0.7.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import devToolsEnhancer from '@redux-devtools/remote';
+ import { devToolsEnhancer } from '@redux-devtools/remote';
```
