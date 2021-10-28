import { createStore, compose } from 'redux';
import {
  reduxReactRouter,
  routerStateReducer,
  ReduxRouter,
} from 'redux-router';
//import createHistory from 'history/lib/createBrowserHistory';
import devTools from 'remote-redux-devtools';
import createHistory from 'history/lib/createHashHistory';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let finalCreateStore = compose(
    reduxReactRouter({ createHistory }),
    devTools({ realtime: true })
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
