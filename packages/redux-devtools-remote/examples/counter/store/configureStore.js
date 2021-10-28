import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';
import { composeWithDevTools } from 'remote-redux-devtools';
import reducer from '../reducers';
import * as actionCreators from '../actions/counter';

export default function configureStore(initialState) {
  const composeEnhancers = composeWithDevTools({
    realtime: true,
    actionCreators,
    trace: true,
  });
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(invariant(), thunk))
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
