Redux DevTools
=========================

A live-editing time travel environment for [Redux](https://github.com/rackt/redux).  
**[See Dan's React Europe talk demoing it!](http://youtube.com/watch?v=xsSnOQynTHs)**

[![build status](https://img.shields.io/travis/gaearon/redux-devtools/master.svg?style=flat-square)](https://travis-ci.org/gaearon/redux-devtools)
[![npm version](https://img.shields.io/npm/v/redux-devtools.svg?style=flat-square)](https://www.npmjs.com/package/redux-devtools)
[![npm downloads](https://img.shields.io/npm/dm/redux-devtools.svg?style=flat-square)](https://www.npmjs.com/package/redux-devtools)
[![redux channel on discord](https://img.shields.io/badge/discord-redux@reactiflux-738bd7.svg?style=flat-square)](https://discord.gg/0ZcbPKXt5bWb10Ma)

![](http://i.imgur.com/J4GeW0M.gif)

### Features

* Lets you inspect every state and action payload
* Lets you go back in time by “cancelling” actions
* If you change the reducer code, each “staged” action will be re-evaluated
* If the reducers throw, you will see during which action this happened, and what the error was
* With `persistState()` store enhancer, you can persist debug sessions across page reloads

### Overview

Redux DevTools is a development time package that provides power-ups for your Redux development workflow. Be careful to strip its code in production! To use Redux DevTools, you need to choose a “monitor”—a React component that will serve as a UI for the DevTools. Different tasks and workflows require different UIs, so Redux DevTools is built to be flexible in this regard. We recommend using [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) for inspecting the state and time travel, and wrap it in a [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) to quickly move it across the screen. That said, when you’re comfortable rolling up your own setup, feel free to do this, and share it with us.

### Installation

```
npm install --save-dev redux-devtools
```

You’ll also likely want to install some monitors:

```
npm install --save-dev redux-devtools-log-monitor
npm install --save-dev redux-devtools-dock-monitor
```

### Usage

#### Create a `DevTools` Component

Somewhere in your project, create a `DevTools` component by passing a `monitor` element to `createDevTools`. In the following example our `monitor` consists of [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) docked within [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor):

##### `containers/DevTools.js`

```js
import React from 'react';

// Exported from redux-devtools
import { createDevTools } from 'redux-devtools';

// Monitors are separate packages, and you can make a custom one
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

// createDevTools takes a monitor and produces a DevTools component
const DevTools = createDevTools(
  // Monitors are individually adjustable with props.
  // Consult their repositories to learn about those props.
  // Here, we put LogMonitor inside a DockMonitor.
  <DockMonitor toggleVisibilityKey='ctrl-h'
               changePositionKey='ctrl-q'>
    <LogMonitor theme='tomorrow' />
  </DockMonitor>
);

export default DevTools;
```

Note that you can use `LogMonitor` directly without wrapping it in `DockMonitor` if you’d like to display the DevTools UI somewhere right inside your application:

```js
// If you'd rather not use docking UI, use <LogMonitor> directly
const DevTools = createDevTools(
  <LogMonitor theme='solarized' />
);
```

#### Use `DevTools.instrument()` Store Enhancer

The `DevTools` component you created with `createDevTools()` has a special static method called `instrument()`. It returns a [store enhancer](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer) that you need to use in development.

A store enhancer is a function that takes `createStore` and returns an enhanced version of it that you will use instead. You probably already used another store enhancer—[`applyMiddleware()`](http://redux.js.org/docs/api/applyMiddleware.html). Unlike `applyMiddleware()`, you will need to be careful to only use `DevTools.instrument()` in development environment, and never in production.

The easiest way to apply several store enhancers in a row is to use the [`compose()`](http://redux.js.org/docs/api/compose.html) utility function that ships with Redux. It is the same `compose()` that you can find in Underscore and Lodash. In our case, we would use it to compose several store enhancers into one: `compose(applyMiddleware(m1, m2, m3), DevTools.instrument())`.

It’s important that you should add `DevTools.instrument()` *after* `applyMiddleware` in your `compose()` function arguments. This is because `applyMiddleware` is potentially asynchronous, but `DevTools.instrument()` expects all actions to be plain objects rather than actions interpreted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk). So make sure `applyMiddleware()` goes first in the `compose()` call, and `DevTools.instrument()` goes after it.

##### `store/configureStore.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
    );
  }

  return store;
}
```

If you’d like, you may add another store enhancer called `persistState()`. It ships with this package, and it lets you serialize whole sessions (including all dispatched actions and the state of the monitors) by a URL key. So if you visit `http://localhost:3000/?debug_session=reproducing_weird_bug`, do something in the app, then open `http://localhost:3000/?debug_session=some_other_feature`, and then go back to `http://localhost:3000/?debug_session=reproducing_weird_bug`, the state will be restored. The implementation of `persistState()` is fairly naïve but you can take it as an inspiration and build a proper UI for it if you feel like it!

```js
// ...
import { persistState } from 'redux-devtools';

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
)(createStore);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function configureStore(initialState) {
  // ...
}
```

#### Exclude DevTools from Production Builds

Finally, to make sure we’re not pulling any DevTools-related code in the production builds, we will envify our code. With Webpack, you can use `DefinePlugin` (Browserify equivalent is called [`envify`](https://github.com/zertosh/loose-envify)) to turn magic constants like `process.env.NODE_ENV` into `'production'` or `'development'` strings depending on the environment, and import and render `redux-devtools` conditionally when `process.env.NODE_ENV` is not `'production'`. Then, if you have an Uglify step before production, Uglify will eliminate dead `if (false)` branches with `redux-devtools` imports.

If you are using ES6 modules with Webpack 1.x and Babel, you might try putting your `import` statement inside an `if (process.env.NODE_ENV !== 'production)` to exclude the DevTools package from your production bundle. However this ES6 specification forbids it, so this won’t compile. Instead, you can use a conditional CommonJS `require`. Babel will let it compile, and Uglify will eliminate the dead branches before Webpack creates a bundle. This is why we recommend creating a `configureStore.js` file that either directs you to `configureStore.dev.js` or `configureStore.prod.js` depending on the configuration. While it is a little bit more maintenance, the upside is that you can be sure you won’t pull any development dependencies into the production builds, and that you can easily enable different middleware (e.g. crash reporting, logging) in the production environment.

##### `store/configureStore.js`

```js
// Use ProvidePlugin (Webpack) or loose-envify (Browserify)
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

const finalCreateStore = compose(
  // Middleware you want to use in production:
  applyMiddleware(p1, p2, p3),
  // Other store enhancers if you use any
)(createStore);

export default function configureStore(initialState) {
  return finalCreateStore(rootReducer, initialState);
};
```

##### `store/configureStore.dev.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const finalCreateStore = compose(
  // Middleware you want to use in development:
  applyMiddleware(d1, d2, d3),
  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey())
)(createStore);

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')/*.default if you use Babel 6+ */)
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
  document.getElementById('root')
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
  const popup = window.open(null, 'Redux DevTools', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
  // Reload in case it already exists
  popup.location.reload();
  
  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root')
    );
  }, 10);
}
```

Personal preferences vary, and whether to put the DevTools in a separate window, in a dock, or right inside you app’s user interface, is up to you. Make sure to check the documentation for the monitors you use and learn about the different props they support for customizing the appearance and the behavior.

Note that there are no useful props you can pass to the `DevTools` component other than the `store`. The `store` prop is needed if you don’t wrap `<DevTools>` in a `<Provider>`—just like with any connected component. To adjust the monitors, you need to pass props to them inside `DevTools.js` itself inside the `createDevTools()` call when they are used.

### Gotchas

* **Your reducers have to be pure and free of side effects to work correctly with DevTools.** For example, even generating a random ID in reducer makes it impure and non-deterministic. Instead, do this in action creators.

* **Make sure to only apply `DevTools.instrument()` and render `<DevTools>` in development!** In production, this will be terribly slow because actions just accumulate forever. As described above, you need to use conditional `require`s and use `ProvidePlugin` (Webpack) or `loose-envify` (Browserify) together with Uglify to remove the dead code. Here is [an example](https://github.com/erikras/react-redux-universal-hot-example/) that adds Redux DevTools handling the production case correctly.

* **It is important that `DevTools.instrument()` store enhancer should be added to your middleware stack *after* `applyMiddleware` in the `compose`d functions, as `applyMiddleware` is potentially asynchronous.** Otherwise, DevTools won’t see the raw actions emitted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk).

### Running Examples

Clone the project:

```
git clone https://github.com/gaearon/redux-devtools.git
cd redux-devtools
```

Run `npm install` in the root folder:

```
npm install
```

Now you can open an example folder and run `npm install` there:

```
cd examples/counter # or examples/todomvc
npm install
```

Finally, run the development server and open the page:

```
npm start
open http://localhost:3000
```

Try clicking on actions in the log, or changing some code inside the reducers. You should see the action log re-evaluate the state on every code change.

Also try opening `http://localhost:3000/?debug_session=123`, click around, and then refresh. You should see that all actions have been restored from the local storage.

### Custom Monitors

**DevTools accepts monitor components so you can build a completely custom UI.** [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) and [`DockMonitor`](https://github.com/gaearon/redux-devtools-dock-monitor) are just examples of what is possible.

**[I challenge you to build a custom monitor for Redux DevTools!](https://github.com/gaearon/redux-devtools/issues/3)**

Some crazy ideas for custom monitors:

* A slider that lets you jump between computed states just by dragging it
* An in-app layer that shows the last N states right in the app (e.g. for animation)
* A time machine like interface where the last N states of your app reside on different Z layers
* Feel free to come up with and implement your own! Check [`LogMonitor`](https://github.com/gaearon/redux-devtools-log-monitor) `propTypes` to see what you can do.

In fact some of these are implemented already:

#### [redux-slider-monitor](https://github.com/calesce/redux-slider-monitor)

![](https://camo.githubusercontent.com/d61984306d27d5e0739efc2d57c56ba7aed7996c/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f662e636c2e6c792f6974656d732f3269314c3147316e3161316833793161324f31772f53637265656e2532305265636f7264696e67253230323031352d30382d3034253230617425323030372e3435253230504d2e676966)

#### [redux-devtools-filterable-log-monitor](https://github.com/bvaughn/redux-devtools-filterable-log-monitor/)

![reduxfilterablelogmonitor](https://cloud.githubusercontent.com/assets/29597/11937666/a438d56c-a7ca-11e5-848a-0d535d6c3e25.gif)

#### Keep them coming!

Create a PR to add your custom monitor.

### License

MIT
