# Change Log

## 4.0.0

### Major Changes

- 191d419: Convert d3 packages to ESM

## 3.0.1

### Patch Changes

- 7f5bddbd: Widen peer dependencies

## 3.0.0

### Major Changes

- b323f77d: Upgrade D3

  - Remove UMD build.
  - Upgrade d3 peer dependency from v3 to v7.
  - Remove `attr` configuration method.
  - Rename `style` configuration method to `styles` and move to options.
  - Move `text` configuration method to options.
  - Remove d3 parameter as first parameter for `tooltip`.

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import d3tooltip from 'd3tooltip';
+ import { tooltip } from 'd3tooltip';
```

## [1.3.0](https://github.com/reduxjs/redux-devtools/compare/d3tooltip@1.2.3...d3tooltip@1.3.0) (2021-03-06)

### Features

- **d3-state-visualizer:** convert to TypeScript ([#640](https://github.com/reduxjs/redux-devtools/issues/640)) ([0c78a5a](https://github.com/reduxjs/redux-devtools/commit/0c78a5a9a76ee7eff37dcd8e39272d98c03e0869))
- **d3tooltip:** convert to TypeScript ([#639](https://github.com/reduxjs/redux-devtools/issues/639)) ([3b580da](https://github.com/reduxjs/redux-devtools/commit/3b580dad4cb36abc395f9be139b2c3f94e872d87))

## 1.2.3 (2020-08-14)

**Note:** Version bump only for package d3tooltip
