# Recipes

### Using in a typescript project

The recommended way is to use [`@redux-devtools/extension` npm package](/README.md#13-use-redux-devtools-extension-package-from-npm), which contains all typescript definitions. Or you can just use `window as any`:

```js
const store = createStore(
  rootReducer,
  initialState,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
```

Note that you many need to set `no-any` to false in your `tslint.json` file.

Alternatively you can use type-guard in order to avoid
casting to any.

```typescript
import { createStore, StoreEnhancer } from 'redux';

// ...

type WindowWithDevTools = Window & {
  __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer<unknown, {}>;
};

const isReduxDevtoolsExtenstionExist = (
  arg: Window | WindowWithDevTools,
): arg is WindowWithDevTools => {
  return '__REDUX_DEVTOOLS_EXTENSION__' in arg;
};

// ...

const store = createStore(
  rootReducer,
  initialState,
  isReduxDevtoolsExtenstionExist(window)
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined,
);
```

### Export from browser console or from application

```js
store.liftedStore.getState();
```

The extension is not sharing `store` object, so you should take care of that.

### Applying multiple times with different sets of options

We're [not allowing that from instrumentation part](https://github.com/reduxjs/redux-devtools/blob/main/packages/redux-devtools-extension/src/logOnly.ts), which can be used it like so:

```js
import { createStore, compose } from 'redux';
import { devToolsEnhancerLogOnly } from '@redux-devtools/extension';

const store = createStore(
  reducer,
  /* preloadedState, */ compose(
    devToolsEnhancerLogOnly({
      instaceID: 1,
      name: 'Denylisted',
      actionsDenylist: '...',
    }),
    devToolsEnhancerLogOnly({
      instaceID: 2,
      name: 'Allowlisted',
      actionsAllowlist: '...',
    }),
  ),
);
```
