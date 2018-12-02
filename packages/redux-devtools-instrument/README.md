Redux DevTools Instrumentation
==============================

Redux enhancer used along with [Redux DevTools](https://github.com/gaearon/redux-devtools) or [Remote Redux DevTools](https://github.com/zalmoxisus/remote-redux-devtools).

### Installation

```
npm install --save-dev redux-devtools-instrument
```

### Usage

Add the store enhancer:

##### `store/configureStore.js`

```js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import devTools from 'remote-redux-devtools';
import reducer from '../reducers';

// Usually you import the reducer from the monitor
// or apply with createDevTools as explained in Redux DevTools
const monitorReducer = (state = {}, action) => state; 

export default function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(...middlewares),
    // other enhancers and applyMiddleware should be added before the instrumentation
    instrument(monitorReducer, { maxAge: 50 })
  );
  
  // Note: passing enhancer as last argument requires redux@>=3.1.0
  return createStore(reducer, initialState, enhancer);
}
```

### API

`instrument(monitorReducer, [options])`

- arguments
  - **monitorReducer** *function* called whenever an action is dispatched ([see the example of a monitor reducer](https://github.com/gaearon/redux-devtools-log-monitor/blob/master/src/reducers.js#L13)).
  - **options** *object*
    - **maxAge** *number* or *function*(currentLiftedAction, previousLiftedState) - maximum allowed actions to be stored on the history tree, the oldest actions are removed once `maxAge` is reached. Can be generated dynamically with a function getting current action as argument.
    - **shouldCatchErrors** *boolean* - if specified as `true`, whenever there's an exception in reducers, the monitors will show the error message, and next actions will not be dispatched.
    - **shouldRecordChanges** *boolean* - if specified as `false`, it will not record the changes till `pauseRecording(false)` is dispatched. Default is `true`.
    - **pauseActionType** *string* - if specified, whenever `pauseRecording(false)` lifted action is dispatched and there are actions in the history log, will add this action type. If not specified, will commit when paused.
    - **shouldStartLocked** *boolean* - if specified as `true`, it will not allow any non-monitor actions to be dispatched till `lockChanges(false)` is dispatched. Default is `false`.
    - **shouldHotReload** *boolean* - if set to `false`, will not recompute the states on hot reloading (or on replacing the reducers). Default to `true`.
    - **shouldIncludeCallstack** *boolean* - if set to `true`, will include callstack for every dispatched action. Default to `false`.

### License

MIT
