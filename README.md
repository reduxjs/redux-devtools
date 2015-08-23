Redux DevTools
=========================

A live-editing time travel environment for [Redux](https://github.com/rackt/redux).  
**[See Dan's React Europe talk demoing it!](http://youtube.com/watch?v=xsSnOQynTHs)**

![](http://i.imgur.com/J4GeW0M.gif)

### Features

* Lets you inspect every state and action payload
* Lets you go back in time by “cancelling” actions
* If you change the reducer code, each “staged” action will be re-evaluted
* If the reducers throw, you will see during which action this happened, and what the error was
* With `persistState()` store enhancer, you can persist debug sessions across page reloads
* To monitor a part of  the state, you can set a `select` prop on the DevTools component: `<DevTools select={state => state.todos} store={store} monitor={LogMonitor} />`

### Installation

```
npm install --save-dev redux-devtools
```

DevTools is a [store enhancer](http://rackt.github.io/redux/docs/Glossary.html#store-enhancer), which should be added to your middleware stack *after* [`applyMiddleware`](http://rackt.github.io/redux/docs/api/applyMiddleware.html) as `applyMiddleware` is potentially asynchronous. Otherwise, DevTools won’t see the raw actions emitted by asynchronous middleware such as [redux-promise](https://github.com/acdlite/redux-promise) or [redux-thunk](https://github.com/gaearon/redux-thunk).

To install, firstly import `devTools` into your root React component:

```js
// Redux utility functions
import { compose, createStore, applyMiddleware } from 'redux';
// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
```

Then, add `devTools` to your store enhancers, and create your store:

```js
const finalCreateStore = compose(
  // Enables your middleware:
  applyMiddleware(thunk),
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/)),
  createStore
);

const store = finalCreateStore(reducer);
```

Finally, include the `DevTools` in your page. You may pass either `LogMonitor` (the default one) or any of the custom monitors described below. For convenience, you can use `DebugPanel` to dock `DevTools` to some part of the screen, but you can put it also somewhere else in the component tree.

```js
export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          {() => <CounterApp />}
        </Provider>
        <DebugPanel top right bottom>
          <DevTools store={store} monitor={LogMonitor} />
        </DebugPanel>
      </div>
    );
  }
}
```

[This commit](https://github.com/gaearon/redux-devtools/commit/0a2a97556e252bfad822ca438923774bc8b932a4) should give you an idea about how to add Redux DevTools for your app **but make sure to only apply `devTools()` in development!** In production, this will be terribly slow because actions just accumulate forever. (We'll need to implement a rolling window for dev too.)

For example, in Webpack, you can use `DefinePlugin` to turn magic constants like `__DEV__` into `true` or `false` depending on the environment, and import and render `redux-devtools` conditionally behind `if (__DEV__)`. Then, if you have an Uglify step before production, Uglify will eliminate dead `if (false)` branches with `redux-devtools` imports. Here is [an example](https://github.com/erikras/react-redux-universal-hot-example/compare/66bf63fb0f23a3c264a5d37c3acb4c047bf0c0c9...c6515236a1def8a3d2bfeb8f6cd6f0ccdb2f9e1b) of adding React DevTools to a project handling the production case correctly.

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

**You can build a completely custom UI for it** because `<DevTools>` accepts a `monitor` React component prop. The included `LogMonitor` is just an example.

**[I challenge you to build a custom monitor for Redux DevTools!](https://github.com/gaearon/redux-devtools/issues/3)**

Some crazy ideas for custom monitors:

* A slider that lets you jump between computed states just by dragging it
* An in-app layer that shows the last N states right in the app (e.g. for animation)
* A time machine like interface where the last N states of your app reside on different Z layers
* Feel free to come up with and implement your own! Check `LogMonitor` propTypes to see what you can do.

In fact some of these are implemented already:

#### [redux-devtools-diff-monitor](https://github.com/whetstone/redux-devtools-diff-monitor)

![](http://i.imgur.com/rvCR9OQ.png)

#### [redux-slider-monitor](https://github.com/calesce/redux-slider-monitor)

![](https://camo.githubusercontent.com/d61984306d27d5e0739efc2d57c56ba7aed7996c/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f662e636c2e6c792f6974656d732f3269314c3147316e3161316833793161324f31772f53637265656e2532305265636f7264696e67253230323031352d30382d3034253230617425323030372e3435253230504d2e676966)

#### [redux-devtools-gentest-plugin](https://github.com/lapanoid/redux-devtools-gentest-plugin)

![](https://camo.githubusercontent.com/71452cc55bc2ac2016dc05e4b6207c5777028a67/687474703a2f2f646c312e6a6f78692e6e65742f64726976652f303031302f333937372f3639323130352f3135303731362f643235343637613236362e706e67)

#### Keep them coming!

Create a PR to add your custom monitor.

### License

MIT
