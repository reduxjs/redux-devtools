# Integrations for js and non-js frameworks

Mostly functional:
- [React](#react)
- [Angular](#angular)
- [Cycle](#cycle)
- [Ember](#ember)
- [Fable](#fable)
- [Freezer](#freezer)
- [Mobx](#mobx)
- [PureScript](#purescript)
- [Reductive](#reductive)
- [Aurelia](#aurelia)

In progress:
- [ClojureScript](#clojurescript)
- [Horizon](#horizon)
- [Python](#python)
- [Swift](#swift)

### [React](https://github.com/facebook/react)
#### Inspect React props
##### [`react-inspect-props`](https://github.com/lucasconstantino/react-inspect-props)
```js
import { compose, withState } from 'recompose'
import { inspectProps } from 'react-inspect-props'

compose(
  withState('count', 'setCount', 0),
  inspectProps('Counter inspector')
)(Counter)
```

#### Inspect React states
##### [`remotedev-react-state`](https://github.com/jhen0409/remotedev-react-state)
```js
import connectToDevTools from 'remotedev-react-state'

componentWillMount() {
    // Connect to devtools after setup initial state
    connectToDevTools(this/*, options */)
  }
```

#### Inspect React hooks (useState and useReducer)
##### [`reinspect`](https://github.com/troch/reinspect)
```js
import { useState } from 'reinspect'

export function CounterWithUseState({ id }) {
    const [count, setCount] = useState(0, id)
    // ...
}
```

### [Mobx](https://github.com/mobxjs/mobx)
#### [`mobx-remotedev`](https://github.com/zalmoxisus/mobx-remotedev)
```js
import remotedev from 'mobx-remotedev';
// or import remotedev from 'mobx-remotedev/lib/dev'
// in case you want to use it in production or don't have process.env.NODE_ENV === 'development'

const appStore = observable({
  // ...
});

// Or
class appStore {
    // ...
}

export default remotedev(appStore);
````

### [Angular](https://github.com/angular/angular)
#### [ng2-redux](https://github.com/angular-redux/ng2-redux)
```js
import { NgReduxModule, NgRedux, DevToolsExtension } from 'ng2-redux';

@NgModule({
  /* ... */
  imports: [ /* ... */, NgReduxModule ]
})export class AppModule {
  constructor(
    private ngRedux: NgRedux,
    private devTools: DevToolsExtension) {

    let enhancers = [];
    // ... add whatever other enhancers you want.

    // You probably only want to expose this tool in devMode.
    if (__DEVMODE__ && devTools.isEnabled()) {
      enhancers = [ ...enhancers, devTools.enhancer() ];
    }

    this.ngRedux.configureStore(
      rootReducer,
      initialState,
      [],
      enhancers);
  }
}
```
For Angular 1 see [ng-redux](https://github.com/angular-redux/ng-redux).

#### [Angular @ngrx/store](https://ngrx.io/) + [`@ngrx/store-devtools`](https://ngrx.io/guide/store-devtools)
```js
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  imports: [
    StoreModule.forRoot(rootReducer),
    // Instrumentation must be imported after importing StoreModule (config is optional)
    StoreDevtoolsModule.instrument({
      maxAge: 5
    })
  ]
})
export class AppModule { }
```

[`Example of integration`](https://github.com/ngrx/platform/tree/master/projects/example-app/) ([live demo](https://ngrx.github.io/platform/example-app/)).

### [Ember](http://emberjs.com/)
#### [`ember-redux`](https://github.com/ember-redux/ember-redux)
```js
//app/enhancers/index.js
import { compose } from 'redux';
var devtools = window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f;
export default compose(devtools);
```

### [Cycle](https://github.com/cyclejs/cyclejs)
#### [`@culli/store`](https://github.com/milankinen/culli/tree/master/packages/store)
```js
import {run} from "@cycle/most-run"
import {makeDOMDriver as DOM} from "@cycle/dom"
import Store, {ReduxDevtools} from "@culli/store"
import App, {newId} from "./App"


run(App, {
  DOM: DOM("#app"),
  Store: Store(ReduxDevtools({items: [{id: newId(), num: 0}, {id: newId(), num: 0}]}))
})
```

### [Freezer](https://github.com/arqex/freezer)
#### [`freezer-redux-devtools`](https://github.com/arqex/freezer-redux-devtools)
```js
import React, { Component } from 'react';
import { supportChromeExtension } from 'freezer-redux-devtools/freezer-redux-middleware';
import Freezer from 'freezer-js';

// Our state is a freezer object
var State = new Freezer({hello: 'world'});

// Enable the extension
supportChromeExtension( State );
```

### [Horizon](https://github.com/rethinkdb/horizon)
#### [`horizon-remotedev`](https://github.com/zalmoxisus/horizon-remotedev)
```js
// import hzRemotedev from 'horizon-remotedev';
// or import hzRemotedev from 'horizon-remotedev/lib/dev'
// in case you want to use it in production or don't have process.env.NODE_ENV === 'development'

//Setup Horizon connection
const horizon = Horizon();

// ...
// Specify the horizon instance to monitor
hzRemotedev(horizon("react_messages"))
```

### [Fable](https://github.com/fable-compiler/Fable)
#### [`fable-elmish/debugger`](https://github.com/fable-elmish/debugger)
```fsharp
open Elmish.Debug

Program.mkProgram init update view
|> Program.withDebugger // connect to a devtools monitor via Chrome extension if available
|> Program.run

```

or

```fsharp
open Elmish.Debug

Program.mkProgram init update view
|> Program.withDebuggerAt (Remote("localhost",8000)) // connect to a server running on localhost:8000
|> Program.run
```

### [PureScript](https://github.com/purescript/purescript)
#### [`purescript-react-redux`](https://github.com/ethul/purescript-react-redux)
[`Example of integration`](https://github.com/ethul/purescript-react-redux-example).

### [ClojureScript](https://github.com/clojure/clojurescript)
[`Example of integration`](http://gitlab.xet.ru:9999/publicpr/clojurescript-redux/tree/master#dev-setup)

### [Python](https://www.python.org/)
#### [`pyredux`](https://github.com/peterpeter5/pyredux)
[WIP](https://github.com/zalmoxisus/remotedev-server/issues/34)

### [Swift](https://github.com/apple/swift)
#### [`katanaMonitor`](https://github.com/bolismauro/katanaMonitor-lib-swift) for [`katana-swift`](https://github.com/BendingSpoons/katana-swift)
```swift
import KatanaMonitor

var middleware: [StoreMiddleware] = [
// other middleware
]

#if DEBUG
middleware.append(MonitorMiddleware.create(using: .defaultConfiguration))
#endif
```

### [Reductive](https://github.com/reasonml-community/reductive)
#### [`reductive-dev-tools`](https://github.com/ambientlight/reductive-dev-tools)
```reason
let storeEnhancer =
  ReductiveDevTools.(
    Connectors.reductiveEnhancer(
      Extension.enhancerOptions(~name="MyApp", ()),
    )
  );
  
let storeCreator = storeEnhancer @@ Reductive.Store.create;
```

### [Aurelia](http://aurelia.io)
#### [`aurelia-store`](https://aurelia.io/docs/plugins/store)
```ts
import {Aurelia} from 'aurelia-framework';
import {initialState} from './state';
  
export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');
  
    ...
  
  aurelia.use.plugin('aurelia-store', {
    initialState,
    devToolsOptions: { // optional
      ... // see https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/API/Arguments.md
    },
  });
  
  aurelia.start().then(() => aurelia.setRoot());
}
```
