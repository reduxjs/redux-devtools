# Troubleshooting

### I just see empty log or "No store found"

Make sure you [applied the enhancer](https://github.com/zalmoxisus/redux-devtools-extension#2-use-with-redux). Note that passing enhancer as last argument requires redux@>=3.1.0. For older versions apply it like [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/todomvc/store/configureStore.js) or [here](https://github.com/zalmoxisus/redux-devtools-extension/blob/v0.4.2/examples/counter/store/configureStore.js#L7-L12).

Don't mix the old Redux API with the new one. Pass enhancers and applyMiddleware as last createStore argument.

### Access file url (`file:///`) 

If you develop on your local filesystem, make sure to allow Redux DevTools access to `file:///` URLs in the settings of this extension:

<img width="746" alt="extensions" src="https://cloud.githubusercontent.com/assets/7957859/19075220/a0fad99e-8a4c-11e6-8b87-757f2dc179cb.png">

### It shows only the `@@INIT` action or moving back and forth doesn't update the state

Most likely you mutate the state. Check it by [adding `redux-immutable-state-invariant` middleware](https://github.com/zalmoxisus/redux-devtools-extension/blob/master/examples/counter/store/configureStore.js#L3).

### @@INIT or REPLACE action resets the state of the app or last actions RE-APPLIED

`@@redux/REPLACE` (or `@@INIT`) is used internally when the application is hot reloaded. When you use `store.replaceReducer` the effect will be the same as for hot-reloading, where the extension is recomputing all the history again. To avoid that set [`shouldHotReload`](/docs/API/Arguments.md#shouldhotreload) parameter to `false`. 

### It doesn't work with other store enhancers 

Usually the extension's store enhancer should be last in the compose. When you're using [`window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__`](/README.md#12-advanced-store-setup) or [`composeWithDevTools`](/README.md#13-use-redux-devtools-extension-package-from-npm) helper you don't have to worry about the enhancers order. However some enhancers ([like `redux-batched-subscribe`](https://github.com/zalmoxisus/redux-devtools-extension/issues/261)) also have this requirement to be the last in the compose. In this case you can use it like so:

```js
const store = createStore(reducer, preloadedState, compose(
  // applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop,
  batchedSubscribe(/* ... */)
));
```

Where `batchedSubscribe` is `redux-batched-subscribe` store enhancer.

### Excessive use of memory and CPU

That is happening due to serialization of some huge objects included in the state or action. The solution is to [sanitize them](/docs/API/Arguments.md#actionsanitizer--statesanitizer).

You can do that by including/omitting data containing specific values, having specific types... In the example below we're omitting parts of action and state objects with the key `data` (in case of action only when was dispatched action `FILE_DOWNLOAD_SUCCESS`):

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

There's a more advanced [example on how to implement that for `ui-router`](https://github.com/zalmoxisus/redux-devtools-extension/issues/455#issuecomment-404538385).

The extension is in different process and cannot access the store object directly, unlike vanilla [`redux-devtools`](https://github.com/reduxjs/redux-devtools) which doesn't have this issue. In case sanitizing doesn't fit your use case, you might consider including it directly as a react component, so there will be no need to serialize the data, but it would add some complexity.

### It fails to serialize data when [passing synthetic events](https://github.com/zalmoxisus/redux-devtools-extension/issues/275) or [calling an action directly with `redux-actions`](https://github.com/zalmoxisus/redux-devtools-extension/issues/287)

React synthetic event cannot be reused for performance reason. So, it's not possible to serialize event objects you pass to action payloads.
 
1. The best solution is **not to pass the whole event object to reducers, but the data you need**:
  ```diff
  function click(event) {
    return {
      type: ELEMENT_CLICKED,
  -    event: event
  +    value: event.target.value
    };
  }
  ```

2. If you cannot pick data from the event object or, for some reason, you need the whole object, use `event.persist()` as suggested in [React Docs](https://facebook.github.io/react/docs/events.html#event-pooling), but it will consume RAM while not needed.
   
   ```diff
   function increment(event) {
   + event.persist();
     return {
       type: ELEMENT_CLICKED,
       event: event,
     };
   }
   ```

3. A workaround, to pass the whole object and at the same time not to persist it, is to override this key of the stringified payload in your action creator. Add a custom `toJSON` function right in the action object (which will be called by the extension before accessing the object):
   
   ```diff
   function increment(event) {
     return {
       type: ELEMENT_CLICKED,
       event: event,
   +   toJSON: function (){
   +     return { ...this, event: '[Event]' };
   +   }
     };
   }
   ```
   Note that it shouldn't be arrow function as we want to have access to the function's `this`.
   
   As we don't have access to the original object, skipping and recomputing actions during hot reloading will not work in this case. We recommend to use the first solution whenever possible.

### Symbols or other unserializable data not shown 

To get data which cannot be serialized by `JSON.stringify`, set [`serialize` parameter](/docs/API/Arguments.md#serialize):
```js
const store = Redux.createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({
   serialize: true
}));
```

It will handle also date, regex, undefined, error objects, symbols, maps, sets and functions.
