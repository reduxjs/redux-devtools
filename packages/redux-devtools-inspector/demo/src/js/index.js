import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import DemoApp from './DemoApp';
import { Provider } from 'react-redux';
import createRootReducer from './reducers';
import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import { Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { persistState } from 'redux-devtools';
import getOptions from './getOptions';
import { ConnectedDevTools, getDevTools } from './DevTools';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

const ROOT =
  process.env.NODE_ENV === 'production' ? '/redux-devtools-inspector/' : '/';

const DevTools = getDevTools(window.location);

const history = createBrowserHistory();

const useDevtoolsExtension =
  !!window.__REDUX_DEVTOOLS_EXTENSION__ &&
  getOptions(window.location).useExtension;

const enhancer = compose(
  applyMiddleware(logger, routerMiddleware(history)),
  (...args) => {
    const instrument = useDevtoolsExtension
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : DevTools.instrument();
    return instrument(...args);
  },
  persistState(getDebugSessionKey())
);

const store = createStore(createRootReducer(history), {}, enhancer);

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
