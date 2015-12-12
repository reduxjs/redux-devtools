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

### Installation

```
npm install --save-dev redux-devtools
```

DevTools is a [store enhancer](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer), which should be added to your middleware stack *after* [`applyMiddleware`](http://rackt.github.io/redux/docs/api/applyMiddleware.html) as `applyMiddleware` is potentially asynchronous. Otherwise, DevTools won’t see the raw actions emitted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk).

To use, first create a `DevTools` component by passing a `monitor` component to `createDevTools`. In the following example our `monitor` consists of [`redux-devtools-log-monitor`](https://github.com/gaearon/redux-devtools-log-monitor) docked within [`redux-devtools-dock-monitor`](https://github.com/gaearon/redux-devtools-dock-monitor):

####containers/DevTools.js

```js
import React from 'react';

// createDevTools takes a monitor and produces a DevTools component
import { createDevTools } from 'redux-devtools';

// Monitor component for Redux DevTools
import LogMonitor from 'redux-devtools-log-monitor';

// Dock component to contain a Redux DevTools monitor
import DockMonitor from 'redux-devtools-dock-monitor';

export default createDevTools(
  <DockMonitor toggleVisibilityKey='H'
               changePositionKey='Q'>
    <LogMonitor />
  </DockMonitor>
);
```

Note that it is not essential to put [`redux-devtools-log-monitor`](https://github.com/gaearon/redux-devtools-log-monitor) inside the dock component, it can be placed wherever you like in the component tree.

Next add `instrument()` and (optionally) `persistState()` to your store enhancers, and create your store:

```js

import { createStore, compose } from 'redux';
import { persistState } from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';

const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(m1, m2, m3), // any Redux middleware, e.g. redux-thunk

  // Provide support for DevTools
  DevTools.instrument(),

  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  // enable hot reloading for the store
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
```

Finally, include the DevTools component in your page:

####index.js

```js
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import TodoApp from './TodoApp';
import DevTools from './DevTools';

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

**Make sure to only use DevTools in development!** In production it will be terribly slow because currently actions just accumulate forever.

In Webpack, you can use `DefinePlugin` to turn magic constants like `__DEV__` into `true` or `false` depending on the environment, and import and render `redux-devtools` conditionally behind `if (__DEV__)`. Then, if you have an Uglify step before production, Uglify will eliminate dead `if (false)` branches with `redux-devtools` imports.

If you are using ES6 modules with Webpack 1.x, you might try putting your `import` statement inside an `if (__DEV__)` to exclude the DevTools package from your production bundle. This will not work. However, you can work around this by creating separate `dev` and `prod` Root components that are dynamically imported using commonJS `require`:

####containers/Root.js

```js
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Root.prod');
} else {
  module.exports = require('./Root.dev');
}
```

####Root.dev.js

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

####Root.prod.js

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

### Running Examples

You can do this:

```
git clone https://github.com/gaearon/redux-devtools.git
cd redux-devtools
npm install

cd examples/counter
npm install
npm start
open http://localhost:3000
```

Try clicking on actions in the log, or changing some code inside `examples/counter/reducers/counter`.  
For fun, you can also open `http://localhost:3000/?debug_session=123`, click around, and then refresh.

Oh, and you can do the same with the TodoMVC example as well.

### Custom Monitors

**DevTools accepts monitor components so you can build a completely custom UI.** [`redux-devtools-log-monitor`](https://github.com/gaearon/redux-devtools-log-monitor) and [`redux-devtools-dock-monitor`](https://github.com/gaearon/redux-devtools-dock-monitor) are just examples of what is possible.

**[I challenge you to build a custom monitor for Redux DevTools!](https://github.com/gaearon/redux-devtools/issues/3)**

Some crazy ideas for custom monitors:

* A slider that lets you jump between computed states just by dragging it
* An in-app layer that shows the last N states right in the app (e.g. for animation)
* A time machine like interface where the last N states of your app reside on different Z layers
* Feel free to come up with and implement your own! Check [`redux-devtools-log-monitor`](https://github.com/gaearon/redux-devtools-log-monitor) propTypes to see what you can do.

In fact some of these are implemented already:

#### [redux-slider-monitor](https://github.com/calesce/redux-slider-monitor)

![](https://camo.githubusercontent.com/d61984306d27d5e0739efc2d57c56ba7aed7996c/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f662e636c2e6c792f6974656d732f3269314c3147316e3161316833793161324f31772f53637265656e2532305265636f7264696e67253230323031352d30382d3034253230617425323030372e3435253230504d2e676966)

#### Keep them coming!

Create a PR to add your custom monitor.

### License

MIT
