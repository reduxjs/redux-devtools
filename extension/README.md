# Redux DevTools Extension

[![Join the chat at https://gitter.im/zalmoxisus/redux-devtools-extension](https://badges.gitter.im/zalmoxisus/redux-devtools-extension.svg)](https://gitter.im/zalmoxisus/redux-devtools-extension?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=round-square)](http://makeapullrequest.com)
[![OpenCollective](https://opencollective.com/redux-devtools-extension/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/redux-devtools-extension/sponsors/badge.svg)](#sponsors)

![Demo](https://cloud.githubusercontent.com/assets/7957859/18002950/aacb82fc-6b93-11e6-9ae9-609862c18302.png)

## Installation

### 1. For Chrome
 - from [Chrome Web Store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd);
 - or download `extension.zip` from [last releases](https://github.com/zalmoxisus/redux-devtools-extension/releases), unzip, open `chrome://extensions` url and turn on developer mode from top left and then click; on `Load Unpacked` and select the extracted folder for use
 - or build it with `npm i && npm run build:extension` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./build/extension`;
 - or run it in dev mode with `npm i && npm start` and [load the extension's folder](https://developer.chrome.com/extensions/getstarted#unpacked) `./dev`.

### 2. For Firefox
 - from [Mozilla Add-ons](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/);
 - or build it with `npm i && npm run build:firefox` and [load the extension's folder](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) `./build/firefox` (just select a file from inside the dir).

### 3. For Electron
  - just specify `REDUX_DEVTOOLS` in [`electron-devtools-installer`](https://github.com/GPMDP/electron-devtools-installer).

### 4. For other browsers and non-browser environment
  - use [`remote-redux-devtools`](https://github.com/zalmoxisus/remote-redux-devtools). 

## Usage

> Note that starting from v2.7, `window.devToolsExtension` was renamed to `window.__REDUX_DEVTOOLS_EXTENSION__` / `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__`. 

## 1. With Redux
### 1.1 Basic store
  
For a basic [Redux store](https://redux.js.org/api/createstore#createstorereducer-preloadedstate-enhancer) simply add:
```diff
 const store = createStore(
   reducer, /* preloadedState, */
+  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 );
```

Note that [`preloadedState`](https://redux.js.org/api/createstore#createstorereducer-preloadedstate-enhancer) argument is optional in Redux's [`createStore`](https://redux.js.org/api/createstore#createstorereducer-preloadedstate-enhancer).

> For universal ("isomorphic") apps, prefix it with `typeof window !== 'undefined' &&`.
```js
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
```

> For TypeScript use [`redux-devtools-extension` npm package](#13-use-redux-devtools-extension-package-from-npm), which contains all the definitions, or just use `(window as any)` (see [Recipes](/docs/Recipes.md#using-in-a-typescript-project) for an example).
```js
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
```

In case ESLint is configured to not allow using the underscore dangle, wrap it like so:
```diff
+ /* eslint-disable no-underscore-dangle */
  const store = createStore(
   reducer, /* preloadedState, */
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
+ /* eslint-enable */
```

> **Note**: Passing enhancer as last argument requires **redux@>=3.1.0**. For older versions apply it like [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/todomvc/store/configureStore.js) or [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/counter/store/configureStore.js#L7-L12). Don't mix the old Redux API with the new one.

> You don't need to npm install [`redux-devtools`](https://github.com/gaearon/redux-devtools) when using the extension (that's a different lib).

### 1.2 Advanced store setup
If you setup your store with [middleware and enhancers](http://redux.js.org/docs/api/applyMiddleware.html), change:
```diff
  import { createStore, applyMiddleware, compose } from 'redux';

+ const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
+ const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
- const store = createStore(reducer, /* preloadedState, */ compose(
    applyMiddleware(...middleware)
  ));
```
> Note that when the extension is not installed, we’re using Redux compose here.
  
To specify [extension’s options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md), use it like so:
```js
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
);
const store = createStore(reducer, enhancer);
```

> [See the post for more details](https://medium.com/@zalmoxis/improve-your-development-workflow-with-redux-devtools-extension-f0379227ff83).

### 1.3 Use `redux-devtools-extension` package from npm

To make things easier, there's an npm package to install:
```
npm install --save redux-devtools-extension
```
and to use like so:
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(reducer, composeWithDevTools(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```
To specify [extension’s options](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md#windowdevtoolsextensionconfig):
```js
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});
const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
  applyMiddleware(...middleware),
  // other store enhancers if any
));
```  
> There’re just [few lines of code](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/npm-package/index.js) added to your bundle.

In case you don't include other enhancers and middlewares, just use `devToolsEnhancer`:
```js
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension';

const store = createStore(reducer, /* preloadedState, */ devToolsEnhancer(
  // Specify name here, actionsBlacklist, actionsCreators and other options if needed
));
```    

### 1.4 Using in production
It's useful to include the extension in production as well. Usually you [can use it for development](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f). 

If you want to restrict it there, use `redux-devtools-extension/logOnlyInProduction`:
```js
import { createStore } from 'redux';
import { devToolsEnhancer } from 'redux-devtools-extension/logOnlyInProduction';

const store = createStore(reducer, /* preloadedState, */ devToolsEnhancer(
  // options like actionSanitizer, stateSanitizer
));
```
or with middlewares and enhancers:
 ```js
 import { createStore, applyMiddleware } from 'redux';
 import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';

 const composeEnhancers = composeWithDevTools({
   // options like actionSanitizer, stateSanitizer
 });
 const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
   applyMiddleware(...middleware),
   // other store enhancers if any
 ));
 ```
>  You'll have to add `'process.env.NODE_ENV': JSON.stringify('production')` in your Webpack config for the production bundle ([to envify](https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md#exclude-devtools-from-production-builds)). If you use `create-react-app`, [it already does it for you.](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.prod.js#L253-L257)

 If you're already checking `process.env.NODE_ENV` when creating the store, include `redux-devtools-extension/logOnly` for production environment.

 If you don’t want to allow the extension in production, just use `redux-devtools-extension/developmentOnly`.

> See [the article](https://medium.com/@zalmoxis/using-redux-devtools-in-production-4c5b56c5600f) for more details. 

### 1.5 For React Native, hybrid, desktop and server side Redux apps
For React Native we can use [`react-native-debugger`](https://github.com/jhen0409/react-native-debugger), which already included [the same API](https://github.com/jhen0409/react-native-debugger/blob/master/docs/redux-devtools-integration.md) with Redux DevTools Extension.

For most platforms, include [`Remote Redux DevTools`](https://github.com/zalmoxisus/remote-redux-devtools)'s store enhancer, and from the extension's context menu choose 'Open Remote DevTools' for remote monitoring.

## 2. Without Redux
See [integrations](docs/Integrations.md) and [the blog post](https://medium.com/@zalmoxis/redux-devtools-without-redux-or-how-to-have-a-predictable-state-with-any-architecture-61c5f5a7716f) for more details on how to use the extension with any architecture.
  
## Docs
  - [Options (arguments)](docs/API/Arguments.md)
  - [Methods (advanced API)](docs/API/Methods.md)
  - [FAQ](docs/FAQ.md)
  - Features
    - [Trace actions calls](/docs/Features/Trace.md)
  - [Troubleshooting](docs/Troubleshooting.md)
  - [Articles](docs/Articles.md)
  - [Videos](docs/Videos.md)
  - [Feedback](docs/Feedback.md)

## Demo
Live demos to use the extension with:

 - [Counter](http://zalmoxisus.github.io/examples/counter/)
 - [TodoMVC](http://zalmoxisus.github.io/examples/todomvc/)
 - [Redux Form](http://redux-form.com/6.5.0/examples/simple/)
 - [React Tetris](https://chvin.github.io/react-tetris/?lan=en)
 - [Book Collection (Angular ngrx store)](https://ngrx.github.io/platform/example-app/)

Also see [`./examples` folder](https://github.com/zalmoxisus/redux-devtools-extension/tree/master/examples).

## Backers
Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/redux-devtools-extension#backer)]

<a href="https://opencollective.com/redux-devtools-extension/backer/0/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/1/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/2/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/3/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/4/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/5/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/6/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/7/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/8/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/9/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/10/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/11/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/12/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/13/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/14/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/15/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/16/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/17/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/18/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/19/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/20/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/21/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/22/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/23/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/24/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/25/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/26/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/27/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/28/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/backer/29/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/backer/29/avatar.svg"></a>


## Sponsors
Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/redux-devtools-extension#sponsor)]

<a href="https://opencollective.com/redux-devtools-extension/sponsor/0/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/1/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/2/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/3/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/4/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/5/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/6/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/7/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/8/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/9/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/10/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/11/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/12/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/13/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/14/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/15/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/16/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/17/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/18/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/19/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/20/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/21/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/22/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/23/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/24/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/25/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/26/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/27/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/28/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/redux-devtools-extension/sponsor/29/website" target="_blank"><img src="https://opencollective.com/redux-devtools-extension/sponsor/29/avatar.svg"></a>

## License

MIT

## Created By

If you like this, follow [@mdiordiev](https://twitter.com/mdiordiev) on twitter.
