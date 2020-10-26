import { createStore, compose } from 'redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';
//import createHistory from 'history/lib/createBrowserHistory';
import createHistory from 'history/lib/createHashHistory';
import rootReducer from '../reducers';

export default function configureStore(initialState) {
  let finalCreateStore = compose(
    reduxReactRouter({ createHistory }),
    global.devToolsExtension ? global.devToolsExtension() : f => f
  )(createStore);

  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
