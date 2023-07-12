import { createStore } from 'redux';
import devTools from 'remote-redux-devtools';
import rootReducer from '../reducers';
import * as actionCreators from '../actions/todos';

export default function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    devTools({
      realtime: true,
      actionCreators,
    }),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
