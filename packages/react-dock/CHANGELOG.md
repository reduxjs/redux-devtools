# Change Log

## 0.7.0

### Minor Changes

- bbb1a40: Convert React packages to ESM

## 0.6.0

### Minor Changes

- 8a7eae4: Add React 18 to peerDependencies range

## 0.5.0

- Adds ESM build (https://github.com/reduxjs/redux-devtools/pull/997) and switches the default export to a named export in order to ensure that the CommonJS output and the ESM output are [interchangeable](https://rollupjs.org/guide/en/#outputexports):

```diff
- import Dock from 'react-dock';
+ import { Dock } from 'react-dock';
```

## [0.4.0](https://github.com/reduxjs/redux-devtools/compare/react-dock@0.3.0...react-dock@0.4.0) (2021-03-06)

### Features

- update peer dependencies to allow react@^17 ([#703](https://github.com/reduxjs/redux-devtools/issues/703)) ([2aaa9c1](https://github.com/reduxjs/redux-devtools/commit/2aaa9c10a383e3a7ab20b3ab14639781fd7bb2eb))

## 0.3.0 (2020-09-07)

### Features

- **react-dock:** allow ReactNode children in types ([#610](https://github.com/reduxjs/redux-devtools/issues/610)) ([9000e36](https://github.com/reduxjs/redux-devtools/commit/9000e369cd4ecd21d2f3e32f0112bd332eb8b631))
- **react-dock:** convert to TypeScript ([#607](https://github.com/reduxjs/redux-devtools/issues/607)) ([78ded9e](https://github.com/reduxjs/redux-devtools/commit/78ded9e0ca5ced5f6ae4e6d4474fa133b6d081b9))
- **redux-devtools-inspector:** convert to TypeScript ([#623](https://github.com/reduxjs/redux-devtools/issues/623)) ([c7b0c7a](https://github.com/reduxjs/redux-devtools/commit/c7b0c7aa6e09f46a36b382ae3ec8e38bd48aeb28))
