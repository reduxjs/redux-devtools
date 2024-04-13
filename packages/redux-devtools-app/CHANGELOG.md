# Change Log

## 6.0.1

### Patch Changes

- 191d419: Convert d3 packages to ESM
- Updated dependencies [191d419]
  - d3-state-visualizer@3.0.0
  - @redux-devtools/chart-monitor@5.0.1

## 6.0.0

### Major Changes

- 5cfe3e5: Update min required React version to 16.8.4

### Patch Changes

- Updated dependencies [5cfe3e5]
- Updated dependencies [decc035]
  - @redux-devtools/chart-monitor@5.0.0
  - @redux-devtools/inspector-monitor-test-tab@4.0.0
  - @redux-devtools/inspector-monitor-trace-tab@4.0.0
  - @redux-devtools/inspector-monitor@6.0.0
  - @redux-devtools/log-monitor@5.0.0
  - @redux-devtools/rtk-query-monitor@5.0.0
  - @redux-devtools/slider-monitor@5.0.0
  - @redux-devtools/core@4.0.0

## 5.0.0

### Major Changes

- 158ba2c: Replace jss with Emotion in inspector-monitor. `@emotion/react` is now a required peer dependency.

### Patch Changes

- Updated dependencies [158ba2c]
- Updated dependencies [6954eb9]
  - @redux-devtools/inspector-monitor-test-tab@3.0.0
  - @redux-devtools/inspector-monitor-trace-tab@3.0.0
  - @redux-devtools/inspector-monitor@5.0.0
  - @redux-devtools/rtk-query-monitor@4.0.0

## 4.0.2

### Patch Changes

- 7f5bddbd: Widen peer dependencies
- Updated dependencies [7f5bddbd]
- Updated dependencies [6fc18ed7]
  - @redux-devtools/chart-monitor@4.1.0
  - @redux-devtools/inspector-monitor-test-tab@2.1.0
  - @redux-devtools/inspector-monitor-trace-tab@2.1.0
  - @redux-devtools/inspector-monitor@4.1.0
  - @redux-devtools/log-monitor@4.1.0
  - @redux-devtools/rtk-query-monitor@3.2.0
  - @redux-devtools/slider-monitor@4.1.0
  - @redux-devtools/ui@1.3.1
  - @redux-devtools/core@3.14.0

## 4.0.1

### Patch Changes

- 65205f90: Replace Action<unknown> with Action<string>
- Updated dependencies [65205f90]
  - @redux-devtools/chart-monitor@4.0.1
  - @redux-devtools/inspector-monitor-test-tab@2.0.1
  - @redux-devtools/inspector-monitor-trace-tab@2.0.1
  - @redux-devtools/inspector-monitor@4.0.1
  - @redux-devtools/core@3.13.2

## 4.0.0

### Major Changes

- e57bcb39: The UMD bundle now exports the same thing as the library and includes the CSS in a sperate file. Therfore, the new usage is:

  ```diff
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Redux DevTools</title>
  +   <link href="/redux-devtools-app.min.css" rel="stylesheet" />
    </head>
    <body>
      <div id="root"></div>
      <script src="/react.production.min.js"></script>
      <script src="/react-dom.production.min.js"></script>
      <script src="/redux-devtools-app.min.js"></script>
      <script src="/port.js"></script>
      <script>
        const container = document.querySelector('#root');
  -     const element = React.createElement(ReduxDevToolsApp, {
  +     const element = React.createElement(ReduxDevToolsApp.Root, {
          socketOptions: {
            hostname: location.hostname,
            port: reduxDevToolsPort,
            autoReconnect: true,
          },
        });
        ReactDOM.createRoot(container).render(element);
      </script>
    </body>
  </html>
  ```

## 3.0.0

### Major Changes

- 57751ff9: Add react-dom peerDependency and bump react peerDependency to `^16.8.0 || ^17.0.0 || ^18.0.0`

### Patch Changes

- Updated dependencies [57751ff9]
  - @redux-devtools/inspector-monitor-test-tab@2.0.0
  - @redux-devtools/inspector-monitor-trace-tab@2.0.0
  - @redux-devtools/inspector-monitor@4.0.0

## 2.2.3

### Patch Changes

- fe32709c: Update jsondiffpatch to fix bundling issues.
- Updated dependencies [fe32709c]
  - @redux-devtools/inspector-monitor@3.1.1

## 2.2.2

### Patch Changes

- Updated dependencies [14a79573]
- Updated dependencies [d54adb76]
- Updated dependencies [bb9bd907]
  - @redux-devtools/inspector-monitor@3.1.0
  - @redux-devtools/inspector-monitor-test-tab@2.0.0
  - @redux-devtools/inspector-monitor-trace-tab@2.0.0

## 2.2.1

### Patch Changes

- Updated dependencies [b323f77d]
- Updated dependencies [b323f77d]
  - d3-state-visualizer@2.0.0
  - @redux-devtools/chart-monitor@4.0.0
  - @redux-devtools/inspector-monitor@3.0.2
  - @redux-devtools/log-monitor@4.0.2
  - @redux-devtools/rtk-query-monitor@3.1.1

## 2.2.0

### Minor Changes

- 8a7eae4: Add React 18 to peerDependencies range

### Patch Changes

- Updated dependencies [8a7eae4]
  - @redux-devtools/chart-monitor@3.0.0
  - @redux-devtools/inspector-monitor-test-tab@1.0.0
  - @redux-devtools/inspector-monitor-trace-tab@1.0.0
  - @redux-devtools/inspector-monitor@3.0.0
  - @redux-devtools/log-monitor@4.0.0
  - @redux-devtools/rtk-query-monitor@3.0.0
  - @redux-devtools/slider-monitor@4.0.0
  - @redux-devtools/ui@1.3.0
  - @redux-devtools/core@3.13.0

## 2.1.4

### Patch Changes

- Updated dependencies [4891bf6]
  - @redux-devtools/core@3.12.0
  - @redux-devtools/chart-monitor@2.1.1
  - @redux-devtools/inspector-monitor@2.1.2
  - @redux-devtools/log-monitor@3.1.1
  - @redux-devtools/rtk-query-monitor@2.1.2
  - @redux-devtools/slider-monitor@3.1.2
  - @redux-devtools/inspector-monitor-test-tab@0.8.6
  - @redux-devtools/inspector-monitor-trace-tab@0.3.4

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
