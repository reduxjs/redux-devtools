# Change Log

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
