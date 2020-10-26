# Options

Use with
 - `window.__REDUX_DEVTOOLS_EXTENSION__([options])`
 - `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__([options])()`
 - `window.__REDUX_DEVTOOLS_EXTENSION__.connect([options])`
 - `redux-devtools-extension` npm package:
  ```js
  import { composeWithDevTools } from 'redux-devtools-extension';

  const composeEnhancers = composeWithDevTools(options);
  const store = createStore(reducer, /* preloadedState, */ composeEnhancers(
    applyMiddleware(...middleware),
    // other store enhancers if any
  ));
  ```

The `options` object is optional, and can include any of the following.

### `name`
*string* - the instance name to be shown on the monitor page. Default value is `document.title`. If not specified and there's no document title, it will consist of `tabId` and `instanceId`.
  
### `actionCreators`
*array* or *object* - action creators functions to be available in the Dispatcher. See [the example](https://github.com/zalmoxisus/redux-devtools-extension/commit/477e69d8649dfcdc9bf84dd45605dab7d9775c03).

### `latency`
*number (in ms)* - if more than one action is dispatched in the indicated interval, all new actions will be collected and sent at once. It is the joint between performance and speed. When set to `0`, all actions will be sent instantly. Set it to a higher value when experiencing perf issues (also `maxAge` to a lower value). Default is `500 ms`.
  
### `maxAge`
*number* (>1) - maximum allowed actions to be stored in the history tree. The oldest actions are removed once maxAge is reached. It's critical for performance. Default is `50`.

### `trace`
*boolean* or *function* - if set to `true`, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code ([more details](../Features/Trace.md)). You can use a function (with action object as argument) which should return `new Error().stack` string, getting the stack outside of reducers. Default to `false`.

### `traceLimit`
*number* - maximum stack trace frames to be stored (in case `trace` option was provided as `true`). By default it's `10`. Note that, because extension's calls are excluded, the resulted frames could be 1 less. If `trace` option is a function, `traceLimit` will have no effect, as it's supposed to be handled there.

### `serialize`
*boolean* or *object* which contains:

- **options** `object or boolean`:
   - `undefined` - will use regular `JSON.stringify` to send data (it's the fast mode).
   - `false` - will handle also circular references.
   - `true` - will handle also date, regex, undefined, primitives, error objects, symbols, maps, sets and functions.
   - object, which contains `date`, `regex`, `undefined`, `nan`, `infinity`, `error`, `symbol`, `map`, `set` and `function` keys. For each of them you can indicate if to include (by setting as `true`). For `function` key you can also specify a custom function which handles serialization. See [`jsan`](https://github.com/kolodny/jsan) for more details. Example:

     ```js
     const store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
       serialize: { 
         options: {
          undefined: true,
          function: function(fn) { return fn.toString() }
         }
       }
     }));
     ```

- **replacer** `function(key, value)` - [JSON `replacer` function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) used for both actions and states stringify.

  Example of usage with [mori data structures](https://github.com/swannodette/mori):
  ```js
  const store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: {
      replacer: (key, value) => value && mori.isMap(value) ? mori.toJs(value) : value
    }
  }));
  ```
  In addition, you can specify a data type by adding a [`__serializedType__`](https://github.com/zalmoxisus/remotedev-serialize/blob/master/helpers/index.js#L4) key. So you can deserialize it back while importing or persisting data. Moreover, it will also [show a nice preview showing the provided custom type](https://cloud.githubusercontent.com/assets/7957859/21814330/a17d556a-d761-11e6-85ef-159dd12f36c5.png):
  ```js
  const store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: {
      replacer: (key, value) => {
        if (Immutable.List.isList(value)) { // use your custom data type checker
          return {
            data: value.toArray(), // ImmutableJS custom method to get JS data as array
            __serializedType__: 'ImmutableList' // mark you custom data type to show and retrieve back
          }
        }
      }
    }
  }));
  ```
- **reviver** `function(key, value)` - [JSON `reviver` function](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#Using_the_reviver_parameter) used for parsing the imported actions and states. See [`remotedev-serialize`](https://github.com/zalmoxisus/remotedev-serialize/blob/master/immutable/serialize.js#L8-L41) as an example on how to serialize special data types and get them back:
  ```js
  const store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: {
      reviver: (key, value) => {
        if (typeof value === 'object' && value !== null && '__serializedType__'  in value) {
          switch (value.__serializedType__) {
            case 'ImmutableList': return Immutable.List(value.data);
          }
        }
      }
    }
  }));
  ```

- **immutable** `object` - automatically serialize/deserialize immutablejs via [remotedev-serialize](https://github.com/zalmoxisus/remotedev-serialize). Just pass the Immutable library like so:

  ```js
  import Immutable from 'immutable'; // https://facebook.github.io/immutable-js/
  // ...
  // Like above, only showing off compose this time. Reminder you might not want this in prod.
  const composeEnhancers = typeof window === 'object' && typeof window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ !== 'undefined' ?
   window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
     serialize: {
       immutable: Immutable
     }
  }) : compose;
  ```
  It will support all ImmutableJS structures. You can even export them into a file and get them back. The only exception is `Record` class, for which you should pass in addition the references to your classes in `refs`.
- **refs** `array` - ImmutableJS `Record` classes used to make possible restore its instances back when importing, persisting... Example of usage:
  ``` js
  import Immutable from 'immutable';
  // ...
  
  const ABRecord = Immutable.Record({ a:1, b:2 });
  const myRecord = new ABRecord({ b:3 }); // used in the reducers
  
  const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
    serialize: {
      immutable: Immutable,
      refs: [ABRecord]
    }
  }));
  ```
  
Also you can specify alternative values right in the state object (in the initial state of the reducer) by adding `toJSON` function:

In the example bellow it will always send `{ component: '[React]' }`, regardless of the state's `component` value (useful when you don't want to send lots of unnecessary data):
```js
function component(
  state = { component: null, toJSON: () => ({ component: '[React]' }) }, 
  action
) {
  switch (action.type) {
    case 'ADD_COMPONENT': return { component: action.component };
    default: return state;
  }
}
```

You could also alter the value. For example when state is `{ count: 1 }`, we'll send `{ counter: 10 }` (notice we don't have an arrow function this time to use the object's `this`):  
```js
function counter(
  state = { count: 0, toJSON: function (){ return { conter: this.count * 10 }; } },
  action
) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 };
    default: return state;
  }
}
```

### `actionSanitizer` / `stateSanitizer`
- **actionSanitizer** (*function*) - function which takes `action` object and id number as arguments, and should return `action` object back. See the example bellow.
- **stateSanitizer** (*function*) - function which takes `state` object and index as arguments, and should return `state` object back.

Example of usage:

```js
const actionSanitizer = (action) => (
  action.type === 'FILE_DOWNLOAD_SUCCESS' && action.data ?
  { ...action, data: '<<LONG_BLOB>>' } : action
);
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
  actionSanitizer,
  stateSanitizer: (state) => state.data ? { ...state, data: '<<LONG_BLOB>>' } : state
}));
```

### `actionsBlacklist` / `actionsWhitelist`
*string or array of strings as regex* - actions types to be hidden / shown in the monitors (while passed to the reducers). If `actionsWhitelist` specified, `actionsBlacklist` is ignored.

Example:
```js
createStore(reducer, remotedev({
  sendTo: 'http://localhost:8000',
  actionsBlacklist: 'SOME_ACTION'
  // or actionsBlacklist: ['SOME_ACTION', 'SOME_OTHER_ACTION']
  // or just actionsBlacklist: 'SOME_' to omit both
}))
```

### `predicate`
*function* - called for every action before sending, takes `state` and `action` object, and returns `true` in case it allows sending the current data to the monitor. Use it as a more advanced version of `actionsBlacklist`/`actionsWhitelist` parameters.
Example of usage:

```js
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
  predicate: (state, action) => state.dev.logLevel === VERBOSE && !action.forwarded
}));
```

### `shouldRecordChanges`
*boolean* - if specified as `false`, it will not record the changes till clicking on `Start recording` button. Default is `true`. Available only for Redux enhancer, for others use `autoPause`.

### `pauseActionType`
*string* - if specified, whenever clicking on `Pause recording` button and there are actions in the history log, will add this action type. If not specified, will commit when paused. Available only for Redux enhancer. Default is `@@PAUSED`.

### `autoPause`
*boolean* - auto pauses when the extension’s window is not opened, and so has zero impact on your app when not in use. Not available for Redux enhancer (as it already does it but storing the data to be sent). Default is `false`.

### `shouldStartLocked`
*boolean* - if specified as `true`, it will not allow any non-monitor actions to be dispatched till clicking on `Unlock changes` button. Available only for Redux enhancer. Default is `false`.

### `shouldHotReload`
*boolean* - if set to `false`, will not recompute the states on hot reloading (or on replacing the reducers). Available only for Redux enhancer. Default to `true`.

### `shouldCatchErrors`
*boolean* - if specified as `true`, whenever there's an exception in reducers, the monitors will show the error message, and next actions will not be dispatched.

### `features`
If you want to restrict the extension, just specify the features you allow:
```js
const composeEnhancers = composeWithDevTools({
  features: {
    pause: true, // start/pause recording of dispatched actions
    lock: true, // lock/unlock dispatching actions and side effects    
    persist: true, // persist states on page reloading
    export: true, // export history of actions in a file
    import: 'custom', // import history of actions from a file
    jump: true, // jump back and forth (time travelling)
    skip: true, // skip (cancel) actions
    reorder: true, // drag and drop actions in the history list 
    dispatch: true, // dispatch custom actions or action creators
    test: true // generate tests for the selected actions
  },
  // other options like actionSanitizer, stateSanitizer
});
```
If not specified, all of the features are enabled. When set as an object, only those included as `true` will be allowed.
Note that except `true`/`false`, `import` and `export` can be set as `custom` (which is by default for Redux enhancer), meaning that the importing/exporting occurs on the client side. Otherwise, you'll get/set the data right from the monitor part.
