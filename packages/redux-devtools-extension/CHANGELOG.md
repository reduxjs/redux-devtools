# Change Log

## 3.3.0

### Minor Changes

- a3f86a42: Add Redux 5 to peerDependency range of extension package

## 3.2.6

### Patch Changes

- 65205f90: Replace Action<unknown> with Action<string>

## 3.2.5

### Patch Changes

- a0716740: Fix types for other exports from `@redux-devtools/extension`.

## 3.2.4

### Patch Changes

- 07456db4: Propagate store enhancer generic type when using composeWithDevTools

## 3.2.3

### Patch Changes

- 6cf1865f: Fix type for serialize option

## 3.2.2

### Patch Changes

- 2ec10f0: v3.0.0 had an unintentional breaking change of changing the location of the secondary entrypoints. These secondary exports are now exported from the main entrypoint (https://github.com/reduxjs/redux-devtools/pull/1075) and should be imported like so:

  ```diff
  - import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
  - import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/logOnly';
  - import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
  + import {
  +   composeWithDevToolsDevelopmentOnly,
  +   devToolsEnhancerDevelopmentOnly,
  +   composeWithDevToolsLogOnly,
  +   devToolsEnhancerLogOnly,
  +   composeWithDevToolsLogOnlyInProduction,
  +   devToolsEnhancerLogOnlyInProduction,
  + } from '@redux-devtools/extension';
  ```

## 3.2.1

### Patch Changes

- a25551f: Fix files included in publish

## 3.0.0

- **BREAKING** Rename `redux-devtools-extension` package to `@redux-devtools/extension` (https://github.com/reduxjs/redux-devtools/pull/948).
- **BREAKING** The secondary exports are now exported from the main entrypoint (https://github.com/reduxjs/redux-devtools/pull/1075) (NOTE: this will only work in `@redux-devtools/extension@3.2.2` or later):

```diff
- import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/developmentOnly';
- import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/logOnly';
- import { composeWithDevTools, devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';
+ import {
+   composeWithDevToolsDevelopmentOnly,
+   devToolsEnhancerDevelopmentOnly,
+   composeWithDevToolsLogOnly,
+   devToolsEnhancerLogOnly,
+   composeWithDevToolsLogOnlyInProduction,
+   devToolsEnhancerLogOnlyInProduction,
+ } from '@redux-devtools/extension';
```

- Deprecate `actionsBlacklist` and `actionsWhitelist` in favor of `actionsDenylist` and `actionsAllowlist` (https://github.com/reduxjs/redux-devtools/pull/851).

## 2.13.9 (2021-03-06)

**Note:** Version bump only for package redux-devtools-extension
