# Walkthrough

## Browser Extension

If you don’t want to bother with installing Redux DevTools and integrating it into your project, consider using [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools/tree/master/extension) for Chrome and Firefox. It provides access to the most popular monitors, is easy to configure to filter actions, and doesn’t require installing any packages.

## Manual Integration

If you want to have full control over where DevTools are displayed, or are developing a custom monitor, you will probably want to integrate them manually.
It’s more steps, but you will have full control over monitors and their configuration.

### Installation

```
npm install --save-dev @redux-devtools/core
```

You’ll also likely want to install some monitors:

```
npm install --save-dev @redux-devtools/log-monitor
npm install --save-dev @redux-devtools/dock-monitor
```

### Usage

#### Create a `DevTools` Component

Somewhere in your project, create a `DevTools` component by passing a `monitor` element to `createDevTools`. In the following example our `monitor` consists of [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) docked within [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor):

##### `containers/DevTools.js`

```js
import React from 'react';

// Exported from redux-devtools
import { createDevTools } from '@redux-devtools/core';

// Monitors are separate packages, and you can make a custom one
import { LogMonitor } from '@redux-devtools/log-monitor';
import { DockMonitor } from '@redux-devtools/dock-monitor';

// createDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
  // Monitors are individually adjustable with props.
  // Consult their repositories to learn about those props.
  // Here, we put LogMonitor inside a DockMonitor.
  // Note: DockMonitor is visible by default.
  <DockMonitor
    toggleVisibilityKey="ctrl-h"
    changePositionKey="ctrl-q"
    defaultIsVisible={true}
  >
    <LogMonitor theme="tomorrow" />
  </DockMonitor>,
);

export default DevTools;
```

Note that you can use `LogMonitor` directly without wrapping it in `DockMonitor` if you’d like to display the DevTools UI somewhere right inside your application:

```js
// If you'd rather not use docking UI, use <LogMonitor> directly
const DevTools = createDevTools(<LogMonitor theme="solarized" />);
```

#### Use `DevTools.instrument()` Store Enhancer

The `DevTools` component you created with `createDevTools()` has a special static method called `instrument()`. It returns a [store enhancer](http://redux.js.org/docs/Glossary.html#store-enhancer) that you need to use in development.

A store enhancer is a function that enhances the behavior of `createStore()`. You can pass store enhancer as the last optional argument to `createStore()`. You probably already used another store enhancer—[`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html). Unlike `applyMiddleware()`, you will need to be careful to only use `DevTools.instrument()` in development environment, and never in production.

The easiest way to apply several store enhancers in a row is to use the [`compose()`](http://redux.js.org/docs/api/compose.html) utility function that ships with Redux. It is the same `compose()` that you can find in Underscore and Lodash. In our case, we would use it to compose several store enhancers into one: `compose(applyMiddleware(m1, m2, m3), DevTools.instrument())`.

You can add additional options to it: `DevTools.instrument({ maxAge: 50, shouldCatchErrors: true })`. See [`redux-devtools-instrument`'s API](https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-instrument#api) for more details.

It’s important that you should add `DevTools.instrument()` _after_ `applyMiddleware` in your `compose()` function arguments. This is because `applyMiddleware` is potentially asynchronous, but `DevTools.instrument()` expects all actions to be plain objects rather than actions interpreted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk). So make sure `applyMiddleware()` goes first in the `compose()` call, and `DevTools.instrument()` goes after it.

##### `store/configureStore.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/reactjs/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(
        require('../reducers') /*.default if you use Babel 6+ */,
      ),
    );
  }

  return store;
}
```

If you’d like, you may add another store enhancer called `persistState()`. It ships with this package, and it lets you serialize whole sessions (including all dispatched actions and the state of the monitors) by a URL key. So if you visit `http://localhost:3000/?debug_session=reproducing_weird_bug`, do something in the app, then open `http://localhost:3000/?debug_session=some_other_feature`, and then go back to `http://localhost:3000/?debug_session=reproducing_weird_bug`, the state will be restored. The implementation of `persistState()` is fairly naïve but you can take it as an inspiration and build a proper UI for it if you feel like it!

```js
// ...
import { persistState } from '@redux-devtools/core';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey()),
);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

export default function configureStore(initialState) {
  // ...
}
```

#### Exclude DevTools from Production Builds

Finally, to make sure we’re not pulling any DevTools-related code in the production builds, we will envify our code. You can use [`DefinePlugin`](https://github.com/webpack/docs/wiki/list-of-plugins#defineplugin) with Webpack, or [`envify`](https://github.com/zertosh/loose-envify) for Browserify.

The trick is to replace all occurrences of a constant like `process.env.NODE_ENV` into a string depending on the environment, and import and render `redux-devtools` only when `process.env.NODE_ENV` is not `'production'`. Then, if you have an Uglify step before production, Uglify will eliminate dead `if (false)` branches with `redux-devtools` imports.

With Webpack, you'll need two config files, one for development and one for production. Here's a snippet from an example production config:

##### `webpack.config.prod.js`

```js
// ...
plugins: [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  })
],
// ...
```

If you are using ES6 modules with Webpack 1.x and Babel, you might try putting your `import` statement inside an `if (process.env.NODE_ENV !== 'production)` to exclude the DevTools package from your production bundle. However this ES6 specification forbids it, so this won’t compile. Instead, you can use a conditional CommonJS `require`. Babel will let it compile, and Uglify will eliminate the dead branches before Webpack creates a bundle. This is why we recommend creating a `configureStore.js` file that either directs you to `configureStore.dev.js` or `configureStore.prod.js` depending on the configuration. While it is a little bit more maintenance, the upside is that you can be sure you won’t pull any development dependencies into the production builds, and that you can easily enable different middleware (e.g. crash reporting, logging) in the production environment.

##### `store/configureStore.js`

```js
// Use DefinePlugin (Webpack) or loose-envify (Browserify)
// together with Uglify to strip the dev branch in prod build.
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./configureStore.prod');
} else {
  module.exports = require('./configureStore.dev');
}
```

##### `store/configureStore.prod.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';

// Middleware you want to use in production:
const enhancer = applyMiddleware(p1, p2, p3);

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  return createStore(rootReducer, initialState, enhancer);
}
```

##### `store/configureStore.dev.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from '@redux-devtools/core';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey()),
);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

export default function configureStore(initialState) {
  // Note: only Redux >= 3.1.0 supports passing enhancer as third argument.
  // See https://github.com/rackt/redux/releases/tag/v3.1.0
  const store = createStore(rootReducer, initialState, enhancer);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(
        require('../reducers') /*.default if you use Babel 6+ */,
      ),
    );
  }

  return store;
}
```

#### Render `<DevTools>` in Your App...

Finally, include the `DevTools` component in your page.  
A naïve way to do this would be to render it right in your `index.js`:

##### `index.js`

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import TodoApp from './containers/TodoApp';

// Don't do this! You’re bringing DevTools into the production bundle.
import DevTools from './containers/DevTools';

const store = configureStore();

render(
  <Provider store={store}>
    <div>
      <TodoApp />
      <DevTools />
    </div>
  </Provider>
  document.getElementById('app')
);
```

We recommend a different approach. Create a `Root.js` component that renders the root of your application (usually some component surrounded by a `<Provider>`). Then use the same trick with conditional `require` statements to have two versions of it, one for development, and one for production:

##### `containers/Root.js`

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root.prod');
} else {
  module.exports = require('./Root.dev');
}
```

##### `containers/Root.dev.js`

```js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import DevTools from './DevTools';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <TodoApp />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
```

##### `containers/Root.prod.js`

```js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <TodoApp />
      </Provider>
    );
  }
}
```

#### ...Or Open Them in a New Window

When you use [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor), you usually want to render `<DevTools>` at the root of your app. It will appear in a docked container above it. However, you can also render it anywhere else in your React component tree. To do this, you can remove `DockMonitor` and instead render `<DevTools>` inside some component of your app. Don’t forget to create two versions of this component to exclude `DevTools` in production!

However you don’t even have to render `<DevTools>` in the same window. For example, you may prefer to display it in a popup. In this case, you can remove `DockMonitor` from `DevTools.js` and just use the `LogMonitor`, and have some code like this:

##### `index.js`

```js
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import configureStore from './store/configureStore';
import App from './containers/App';

const store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools');
  showDevTools(store);
}
```

##### `showDevTools.js`

```js
import React from 'react';
import { render } from 'react-dom';
import DevTools from './containers/DevTools';

export default function showDevTools(store) {
  const popup = window.open(
    null,
    'Redux DevTools',
    'menubar=no,location=no,resizable=yes,scrollbars=no,status=no',
  );
  // Reload in case it already exists
  popup.location.reload();

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root'),
    );
  }, 10);
}
```

Personal preferences vary, and whether to put the DevTools in a separate window, in a dock, or right inside you app’s user interface, is up to you. Make sure to check the documentation for the monitors you use and learn about the different props they support for customizing the appearance and the behavior.

Note that there are no useful props you can pass to the `DevTools` component other than the `store`. The `store` prop is needed if you don’t wrap `<DevTools>` in a `<Provider>`—just like with any connected component. To adjust the monitors, you need to pass props to them inside `DevTools.js` itself inside the `createDevTools()` call when they are used.

### Gotchas

- **Your reducers have to be pure and free of side effects to work correctly with DevTools.** For example, even generating a random ID in reducer makes it impure and non-deterministic. Instead, do this in action creators.

- **Make sure to only apply `DevTools.instrument()` and render `<DevTools>` in development!** In production, this will be terribly slow because actions just accumulate forever. As described above, you need to use conditional `require`s and use `DefinePlugin` (Webpack) or `loose-envify` (Browserify) together with Uglify to remove the dead code. Here is [an example](https://github.com/erikras/react-redux-universal-hot-example/) that adds Redux DevTools handling the production case correctly.

- **It is important that `DevTools.instrument()` store enhancer should be added to your middleware stack _after_ `applyMiddleware` in the `compose`d functions, as `applyMiddleware` is potentially asynchronous.** Otherwise, DevTools won’t see the raw actions emitted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk).

### What Next?

Now that you see the DevTools, you might want to learn what those buttons mean and how to use them. This usually depends on the monitor. You can begin by exploring the [LogMonitor](https://github.com/gaearon/redux-devtools-log-monitor) and [DockMonitor](https://github.com/gaearon/redux-devtools-dock-monitor) documentation, as they are the default monitors we suggest to use together. When you’re comfortable using them, you may want to create your own monitor for more exotic purposes, such as a [chart](https://github.com/romseguy/redux-devtools-chart-monitor) or a [diff](https://github.com/whetstone/redux-devtools-diff-monitor) monitor. Don’t forget to send a PR to feature your monitor at the front page!
