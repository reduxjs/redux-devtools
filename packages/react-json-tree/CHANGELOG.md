# Change Log

## 0.16.2

### Patch Changes

- 4c9a890: Fix type import for Typescript versions <4.5

## 0.16.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import JSONTree from 'react-json-tree';
+ import { JSONTree } from 'react-json-tree';
```

## [0.15.0](https://github.com/reduxjs/redux-devtools/compare/react-json-tree@0.14.0...react-json-tree@0.15.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## [0.14.0](https://github.com/reduxjs/redux-devtools/compare/react-json-tree@0.13.0...react-json-tree@0.14.0) (2021-03-06)

### Bug Fixes

- **react-json-tree:** remove isRequired from `data` prop type ([#685](https://github.com/reduxjs/redux-devtools/issues/685)) ([d76d6c6](https://github.com/reduxjs/redux-devtools/commit/d76d6c678d3b3b304cf53c1b4b1b329e8962f7b0))

### Features

- **react-json-tree:** Add keyPath to getItemString ([#694](https://github.com/reduxjs/redux-devtools/issues/694)) ([85b4b0f](https://github.com/reduxjs/redux-devtools/commit/85b4b0fb04b1d6d95054d5073fa17fa61efc0df3))

## [0.13.0](https://github.com/reduxjs/redux-devtools/compare/react-json-tree@0.12.1...react-json-tree@0.13.0) (2020-09-07)

### Bug Fixes

- **react-base16-styling:** fix Styling type ([#602](https://github.com/reduxjs/redux-devtools/issues/602)) ([e7304b5](https://github.com/reduxjs/redux-devtools/commit/e7304b5853a572b53429809ed8ac4b7a198c90f8))

### Features

- **react-dock:** convert to TypeScript ([#607](https://github.com/reduxjs/redux-devtools/issues/607)) ([78ded9e](https://github.com/reduxjs/redux-devtools/commit/78ded9e0ca5ced5f6ae4e6d4474fa133b6d081b9))
- **redux-devtools:** convert counter example to TypeScript ([#616](https://github.com/reduxjs/redux-devtools/issues/616)) ([f1e3f4f](https://github.com/reduxjs/redux-devtools/commit/f1e3f4f8340dea288de5229006acf9dc1ef1cccf))
- **redux-devtools:** convert todomvc example to TypeScript ([#618](https://github.com/reduxjs/redux-devtools/issues/618)) ([37191e4](https://github.com/reduxjs/redux-devtools/commit/37191e46e600cd9ac2839f0687efb347fc4ef7c1))

## [0.12.1](https://github.com/reduxjs/redux-devtools/compare/react-json-tree@0.12.0...react-json-tree@0.12.1) (2020-08-14)

### Bug Fixes

- **react-json-tree:** fix react-json-tree examples ([#531](https://github.com/reduxjs/redux-devtools/issues/531)) ([0864f28](https://github.com/reduxjs/redux-devtools/commit/0864f281560dcbad1ddb2ab985e23b841771cb8c))
