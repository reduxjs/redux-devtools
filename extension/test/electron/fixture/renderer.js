const { createStore } = require('redux');

const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

const initialState = { value: 0 };

const store = createStore(
  (state, action) => {
    switch (action.type) {
      case INCREMENT_COUNTER:
        return { value: state.value + 1 };
      case DECREMENT_COUNTER:
        return { value: state.value - 1 };
      default:
        return state;
    }
  },
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : noop => noop
);

const el = document.getElementById('counter');

store.subscribe(() => {
  el.innerHTML = store.getState().value;
});

const increment = document.getElementById('increment');
const decrement = document.getElementById('decrement');
increment.onclick = () => store.dispatch({ type: INCREMENT_COUNTER });
decrement.onclick = () => store.dispatch({ type: DECREMENT_COUNTER });
