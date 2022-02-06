---
'@redux-devtools/extension': patch
---

v3.0.0 had an unintentional breaking change of changing the location of the secondary entrypoints. These secondary exports are now exported from the main entrypoint (https://github.com/reduxjs/redux-devtools/pull/1075) and should be imported like so:

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
