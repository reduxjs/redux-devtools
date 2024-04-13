# Change Log

## 4.0.1

### Patch Changes

- Updated dependencies [bbb1a40]
  - react-base16-styling@0.10.0

## 4.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [5cfe3e5]
  - @redux-devtools/inspector-monitor@6.0.0

## 3.0.0

### Major Changes

- 158ba2c: Replace jss with Emotion in inspector-monitor. `@emotion/react` is now a required peer dependency.

### Patch Changes

- Updated dependencies [158ba2c]
  - @redux-devtools/inspector-monitor@5.0.0

## 2.1.0

### Minor Changes

- 6fc18ed7: Add new Redux version to peer dependencies

### Patch Changes

- 7f5bddbd: Widen peer dependencies

## 2.0.1

### Patch Changes

- 65205f90: Replace Action<unknown> with Action<string>
- Updated dependencies [65205f90]
  - @redux-devtools/inspector-monitor@4.0.1

## 2.0.0

### Major Changes

- 57751ff9: Add react-dom peerDependency and bump react peerDependency to `^16.8.0 || ^17.0.0 || ^18.0.0`

### Patch Changes

- Updated dependencies [57751ff9]
  - @redux-devtools/inspector-monitor@4.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [14a79573]
- Updated dependencies [d54adb76]
- Updated dependencies [bb9bd907]
  - @redux-devtools/inspector-monitor@3.1.0

## 1.0.0

### Minor Changes

- 8a7eae4: Add React 18 to peerDependencies range

### Patch Changes

- Updated dependencies [8a7eae4]
  - @redux-devtools/inspector-monitor@3.0.0

## 0.3.4

### Patch Changes

- @redux-devtools/inspector-monitor@3.0.0

## 0.3.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import TraceTab from '@redux-devtools/inspector-monitor-trace-tab';
+ import { TraceTab } from '@redux-devtools/inspector-monitor-trace-tab';
```

## [0.2.2](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-trace-tab@0.2.1...@redux-devtools/inspector-monitor-trace-tab@0.2.2) (2021-06-11)

### Bug Fixes

- **app:** fix dependency version of inspector ([#732](https://github.com/reduxjs/redux-devtools/issues/732)) ([30c6971](https://github.com/reduxjs/redux-devtools/commit/30c6971d379c53ec1343a20240b73705751f7445))

## [0.2.1](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-trace-tab@0.2.0...@redux-devtools/inspector-monitor-trace-tab@0.2.1) (2021-06-11)

### Bug Fixes

- fix peer dependencies on inpsector monitor ([#730](https://github.com/reduxjs/redux-devtools/issues/730)) ([0291f5c](https://github.com/reduxjs/redux-devtools/commit/0291f5c95e4340a3b5e30a3efe76a1a1a2bb7f5e))

## [0.2.0](https://github.com/reduxjs/redux-devtools/compare/@redux-devtools/inspector-monitor-trace-tab@0.1.4...@redux-devtools/inspector-monitor-trace-tab@0.2.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 0.1.4 (2021-03-06)

**Note:** Version bump only for package @redux-devtools/inspector-monitor-trace-tab

## [0.1.3](https://github.com/reduxjs/redux-devtools/compare/redux-devtools-trace-monitor@0.1.2...redux-devtools-trace-monitor@0.1.3) (2020-09-07)

**Note:** Version bump only for package redux-devtools-trace-monitor

## 0.1.2 (2020-08-14)

### Bug Fixes

- **redux-devtools-trace-monitor:** consolidate packages ([#540](https://github.com/reduxjs/redux-devtools/issues/540)) ([370134d](https://github.com/reduxjs/redux-devtools/commit/370134d5a2bb7337f72134a9396398ab9f66fe30))
