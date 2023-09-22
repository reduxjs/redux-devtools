# Change Log

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
