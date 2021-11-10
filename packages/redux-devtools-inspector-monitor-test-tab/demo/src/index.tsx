import React from 'react';
import { render } from 'react-dom';
import { Container } from '@redux-devtools/ui';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from 'redux';
import logger from 'redux-logger';
import { Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';
import { persistState } from '@redux-devtools/core';
import DemoApp from './DemoApp';
import createRootReducer from './reducers';
import getOptions from './getOptions';
import { ConnectedDevTools, getDevTools } from './DevTools';

function getDebugSessionKey() {
  const matches = /[?&]debug_session=([^&#]+)\b/.exec(window.location.href);
  return matches && matches.length > 0 ? matches[1] : null;
}

const ROOT =
  process.env.NODE_ENV === 'production'
    ? '/redux-devtools-inspector-monitor-test-tab/'
    : '/';

const DevTools = getDevTools(window.location);

const history = createBrowserHistory();

const useDevtoolsExtension =
  !!(window as unknown as { __REDUX_DEVTOOLS_EXTENSION__: unknown }) &&
  getOptions(window.location).useExtension;

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

const store = createStore(createRootReducer(history), enhancer);

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Container
        themeData={{
          theme: 'default',
          scheme: 'default',
          colorPreference: 'auto',
        }}
      >
        <Route path={ROOT}>
          <DemoApp />
        </Route>
        {!useDevtoolsExtension && <ConnectedDevTools />}
      </Container>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
