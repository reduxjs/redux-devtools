# Change Log

## 4.0.0

### Major Changes

- 191d419: Convert d3 packages to ESM

## 3.0.0

### Major Changes

- b323f77d: Remove UMD build.

## 2.0.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import map2tree from 'map2tree';
+ import { map2tree } from 'map2tree';
```

## [1.5.0](https://github.com/reduxjs/redux-devtools/compare/map2tree@1.4.2...map2tree@1.5.0) (2021-03-06)

### Features

- **d3-state-visualizer:** convert to TypeScript ([#640](https://github.com/reduxjs/redux-devtools/issues/640)) ([0c78a5a](https://github.com/reduxjs/redux-devtools/commit/0c78a5a9a76ee7eff37dcd8e39272d98c03e0869))
- **d3tooltip:** convert to TypeScript ([#639](https://github.com/reduxjs/redux-devtools/issues/639)) ([3b580da](https://github.com/reduxjs/redux-devtools/commit/3b580dad4cb36abc395f9be139b2c3f94e872d87))
- **map2tree:** convert to TypeScript ([#638](https://github.com/reduxjs/redux-devtools/issues/638)) ([3b027f4](https://github.com/reduxjs/redux-devtools/commit/3b027f400e0e326596eedc2ee17ab45a8383080d))

## 1.4.2 (2020-08-14)

### Bug Fixes

- **map2tree:** consolidate immutable version ([#538](https://github.com/reduxjs/redux-devtools/issues/538)) ([999ed2a](https://github.com/reduxjs/redux-devtools/commit/999ed2ad8b4a09eddd55c2a944f5488ecce6bc7b))
