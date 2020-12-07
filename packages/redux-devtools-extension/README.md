# Redux DevTools Extension's helper

[![Join the chat at https://gitter.im/zalmoxisus/redux-devtools-extension](https://badges.gitter.im/zalmoxisus/redux-devtools-extension.svg)](https://gitter.im/zalmoxisus/redux-devtools-extension?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## Usage

Install:

```
npm install --save redux-devtools-extension
```

and use like that:

```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);
```

or if needed to apply [extension’s options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig):

```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(...middleware)
    // other store enhancers if any
  )
);
```

There’re just [few lines of code](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/npm-package/index.js). If you don’t want to allow the extension in production, just use ‘redux-devtools-extension/developmentOnly’ instead of ‘redux-devtools-extension’.

## License

MIT
