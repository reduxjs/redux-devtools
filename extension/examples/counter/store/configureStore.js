import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import invariant from 'redux-immutable-state-invariant';
import reducer from '../reducers';
import * as actionCreators from '../actions/counter'; 

export default function configureStore(preloadedState) {
  const composeEnhancers = composeWithDevTools({ actionCreators, trace: true, traceLimit: 25 });
  const store = createStore(reducer, preloadedState, composeEnhancers(
    applyMiddleware(invariant(), thunk)
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default)
    });
  }

  return store;
}
