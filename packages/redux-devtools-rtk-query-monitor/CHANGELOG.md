# Change Log

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
