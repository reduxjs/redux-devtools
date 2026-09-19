# @redux-devtools/app-core

## 3.0.1

### Patch Changes

- 86f6090: Wrap the monitor area in an error boundary so a crashing monitor or tab shows an error with a "Reset monitor state" button instead of blanking the whole app, and reset persisted `inspectedActionPath` / `inspectedStatePath` / selected action ids on rehydrate so a bad persisted selection cannot crash the monitor on every load.
- 94baca9: Show an error notification and keep the previous instance state when a state payload fails to parse, instead of blanking the panel. Adds `parseErrorMiddleware` (included in the default `middlewares` array).
- Updated dependencies [caea9e9]
- Updated dependencies [86f6090]
  - @redux-devtools/inspector-monitor-trace-tab@5.0.1
  - @redux-devtools/inspector-monitor@7.0.1

## 3.0.0

### Major Changes

- 6481386: Convert remaining packages to ESM

### Patch Changes

- Updated dependencies [d61d31a]
- Updated dependencies [804e729]
- Updated dependencies [12849a4]
- Updated dependencies [804d6bd]
  - @redux-devtools/ui@3.0.0
  - @redux-devtools/chart-monitor@6.0.0
  - @redux-devtools/inspector-monitor@7.0.0
  - @redux-devtools/inspector-monitor-test-tab@6.0.0
  - @redux-devtools/inspector-monitor-trace-tab@5.0.0
  - @redux-devtools/log-monitor@6.0.0
  - @redux-devtools/rtk-query-monitor@7.0.0
  - @redux-devtools/slider-monitor@7.0.0
  - @redux-devtools/core@5.0.0

## 2.0.0

### Major Changes

- 6163276: Replace styled-components with Emotion

### Patch Changes

- Updated dependencies [6163276]
- Updated dependencies [20883e5]
  - @redux-devtools/inspector-monitor-test-tab@5.0.0
  - @redux-devtools/rtk-query-monitor@6.0.0
  - @redux-devtools/slider-monitor@6.0.0
  - @redux-devtools/ui@2.0.0
  - @redux-devtools/inspector-monitor@6.1.2

## 1.1.2

### Patch Changes

- Updated dependencies [17b55ef]
  - @redux-devtools/rtk-query-monitor@5.2.0

## 1.1.1

### Patch Changes

- Updated dependencies [91f21b2]
  - @redux-devtools/core@4.1.1
  - @redux-devtools/chart-monitor@5.1.1
  - @redux-devtools/inspector-monitor@6.1.1
  - @redux-devtools/inspector-monitor-test-tab@4.1.1
  - @redux-devtools/inspector-monitor-trace-tab@4.1.1
  - @redux-devtools/log-monitor@5.1.1
  - @redux-devtools/rtk-query-monitor@5.1.1
  - @redux-devtools/slider-monitor@5.1.1

## 1.1.0

### Minor Changes

- 6830118: Add React 19 to peer deps

### Patch Changes

- Updated dependencies [6830118]
  - @redux-devtools/chart-monitor@6.0.0
  - @redux-devtools/inspector-monitor-test-tab@5.0.0
  - @redux-devtools/inspector-monitor-trace-tab@5.0.0
  - @redux-devtools/inspector-monitor@7.0.0
  - @redux-devtools/log-monitor@6.0.0
  - @redux-devtools/rtk-query-monitor@6.0.0
  - @redux-devtools/slider-monitor@6.0.0
  - @redux-devtools/ui@1.4.0
  - @redux-devtools/core@4.1.0

## 1.0.0

### Major Changes

- 96ac1f2: Move the logic from @redux-devtools/app into @redux-devtools/app-core
