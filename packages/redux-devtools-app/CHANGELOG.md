# Change Log

## 2.1.3

### Patch Changes

- ab3c0e2: Avoid persisting the selected action index between sessions

## 2.1.2

### Patch Changes

- 55cc37e: Fix filter to show state-controlled search value
- Updated dependencies [55cc37e]
  - @redux-devtools/inspector-monitor@2.1.1

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import DevToolsApp from '@redux-devtools/app';
+ import { Root } from '@redux-devtools/app';
```

## [1.0.0-8](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/app@1.0.0-7...@redux-devtools/app@1.0.0-8) (2021-06-11)

### Bug Fixes

- **app:** fix dependency version of inspector ([#732](https://github.com/reduxjs/redux-devtools/issues/732)) ([30c6971](https://github.com/reduxjs/redux-devtools/commit/30c6971d379c53ec1343a20240b73705751f7445))

## [1.0.0-7](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/app@1.0.0-6...@redux-devtools/app@1.0.0-7) (2021-06-11)

### Bug Fixes

- fix Select types and usages ([#724](https://github.com/reduxjs/redux-devtools/issues/724)) ([07e409d](https://github.com/reduxjs/redux-devtools/commit/07e409de6a1c3d362929d854542df0c1d74ce18e))
- **app:** remove unimplemented reports tab ([#731](https://github.com/reduxjs/redux-devtools/issues/731)) ([c4a8fa2](https://github.com/reduxjs/redux-devtools/commit/c4a8fa286cfe3f30133c2f948164001bd2a618ac))

## [1.0.0-6](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/app@1.0.0-5...@redux-devtools/app@1.0.0-6) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 1.0.0-5 (2021-03-06)

**Note:** Version bump only for package @redux-devtools/app

## [1.0.0-4](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-core@1.0.0-3...redux-devtools-core@1.0.0-4) (2020-09-07)

### Bug Fixes

- **redux-devtools-core:** don't mutate source object during stringification ([#627](https://github.com/reduxjs/redux-devtools/issues/627)) ([5259dee](https://github.com/reduxjs/redux-devtools/commit/5259dee601e07c46f8e7af964ab83cb23a4e7b1b))

## [1.0.0-3](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-core@1.0.0-2...redux-devtools-core@1.0.0-3) (2020-08-14)

**Note:** Version bump only for package redux-devtools-core
