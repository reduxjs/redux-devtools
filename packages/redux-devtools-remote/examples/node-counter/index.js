var createStore = require('redux').createStore;
var devTools = require('remote-redux-devtools').default;

function counter(state, action) {
  if (state === undefined) state = 0;
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

var store = createStore(counter, devTools({ realtime: true }));
store.subscribe(function () {
  console.log(store.getState());
});

function incrementer() {
  setTimeout(function () {
    store.dispatch({ type: 'INCREMENT' });
    incrementer();
  }, 1000);
}

incrementer();
