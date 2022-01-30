# Change Log

## 0.8.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import TestGenerator from '@redux-devtools/inspector-monitor-test-tab';
- import mochaTemplate from '@redux-devtools/inspector-monitor-test-tab/lib/redux/mocha';
+ import { TestTab, reduxMochaTemplate } from '@redux-devtools/inspector-monitor-test-tab';
```

## [0.7.2](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-test-tab@0.7.1...@redux-devtools/inspector-monitor-test-tab@0.7.2) (2021-06-11)

### Bug Fixes

- **app:** fix dependency version of inspector ([#732](https://github.com/reduxjs/redux-devtools/issues/732)) ([30c6971](https://github.com/reduxjs/redux-devtools/commit/30c6971d379c53ec1343a20240b73705751f7445))

## [0.7.1](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-test-tab@0.7.0...@redux-devtools/inspector-monitor-test-tab@0.7.1) (2021-06-11)

### Bug Fixes

- fix peer dependencies on inpsector monitor ([#730](https://github.com/reduxjs/redux-devtools/issues/730)) ([0291f5c](https://github.com/reduxjs/redux-devtools/commit/0291f5c95e4340a3b5e30a3efe76a1a1a2bb7f5e))
- fix Select types and usages ([#724](https://github.com/reduxjs/redux-devtools/issues/724)) ([07e409d](https://github.com/reduxjs/redux-devtools/commit/07e409de6a1c3d362929d854542df0c1d74ce18e))

## [0.7.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-test-tab@0.6.3...@redux-devtools/inspector-monitor-test-tab@0.7.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 0.6.3 (2021-03-06)

**Note:** Version bump only for package @redux-devtools/inspector-monitor-test-tab

## [0.6.2](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-test-generator@0.6.1...redux-devtools-test-generator@0.6.2) (2020-09-07)

**Note:** Version bump only for package redux-devtools-test-generator

## [0.6.1](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-test-generator@0.6.0...redux-devtools-test-generator@0.6.1) (2020-08-14)

**Note:** Version bump only for package redux-devtools-test-generator
