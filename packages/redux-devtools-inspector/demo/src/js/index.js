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
import { createDevTools, persistState } from 'redux-devtools';
import DevtoolsInspector from '../../../src/DevtoolsInspector';
import DockMonitor from 'redux-devtools-dock-monitor';
import getOptions from './getOptions';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

const CustomComponent = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      minHeight: '20rem',
    }}
  >
    <div>Custom Tab Content</div>
  </div>
);

const getDevTools = ({ location }) =>
  createDevTools(
    <DockMonitor
      defaultIsVisible
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
    >
      <DevtoolsInspector
        theme={do {
          const match = window.location.search.match(/theme=([^&]+)/);
          match ? match[1] : 'inspector';
        }}
        shouldPersistState
        invertTheme={location.search.indexOf('dark') === -1}
        supportImmutable={location.search.indexOf('immutable') !== -1}
        tabs={(defaultTabs) => [
          {
            name: 'Custom Tab',
            component: CustomComponent,
          },
          ...defaultTabs,
        ]}
      />
    </DockMonitor>
  );

const ROOT =
  process.env.NODE_ENV === 'production' ? '/redux-devtools-inspector/' : '/';

const DevTools = getDevTools(getOptions());

const history = createBrowserHistory();

const useDevtoolsExtension =
  !!window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.location.search.indexOf('ext') !== -1;

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
        {!useDevtoolsExtension && <DevTools />}
      </Route>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
