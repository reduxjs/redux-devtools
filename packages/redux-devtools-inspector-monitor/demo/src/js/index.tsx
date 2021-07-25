import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../js/rtk-query/pokemonApi';
import {
  applyMiddleware,
  compose,
  StoreEnhancerStoreCreator,
  StoreEnhancer,
} from 'redux';
import logger from 'redux-logger';
import { Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { persistState } from '@redux-devtools/core';
import DemoApp from './containers/DemoApp';
import createRootReducer from './reducers';
import getOptions from './getOptions';
import { ConnectedDevTools, getDevTools } from './containers/DevTools';

function getDebugSessionKey() {
  const matches = /[?&]debug_session=([^&#]+)\b/.exec(window.location.href);
  return matches && matches.length > 0 ? matches[1] : null;
}

const ROOT = '/';

const DevTools = getDevTools(window.location);

const history = createBrowserHistory();

const useDevtoolsExtension =
  !!(window as unknown as { __REDUX_DEVTOOLS_EXTENSION__: unknown })
    .__REDUX_DEVTOOLS_EXTENSION__ && getOptions(window.location).useExtension;

const enhancer = compose(
  applyMiddleware(logger, routerMiddleware(history)),
  (next: StoreEnhancerStoreCreator) => {
    const instrument = useDevtoolsExtension
      ? (
          window as unknown as {
            __REDUX_DEVTOOLS_EXTENSION__(): StoreEnhancer;
          }
        ).__REDUX_DEVTOOLS_EXTENSION__()
      : DevTools.instrument();
    return instrument(next);
  },
  persistState(getDebugSessionKey())
);

const store = configureStore({
  reducer: createRootReducer(history),
  devTools: false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat([pokemonApi.middleware]),
  enhancers: [enhancer],
}); //  createStore(createRootReducer(history), enhancer);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path={ROOT}>
        <DemoApp />
      </Route>
      {!useDevtoolsExtension && <ConnectedDevTools />}
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
