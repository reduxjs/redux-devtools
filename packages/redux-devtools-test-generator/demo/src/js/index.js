import '@babel/polyfill';
import 'devui/lib/presets';
import React from 'react';
import { render } from 'react-dom';
import { Container } from 'devui';
import DemoApp from './DemoApp';
import { Provider } from 'react-redux';
import reducers from './reducers';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import { Router, Route, browserHistory } from 'react-router';
import {
  syncHistoryWithStore,
  routerReducer,
  routerMiddleware,
} from 'react-router-redux';
import { createDevTools, persistState } from 'redux-devtools';
import DevtoolsInspector from 'redux-devtools-inspector';
import DockMonitor from 'redux-devtools-dock-monitor';
import getOptions from './getOptions';
import TestGenerator from '../../../src';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return matches && matches.length > 0 ? matches[1] : null;
}

const getDevTools = (options) =>
  createDevTools(
    <DockMonitor
      defaultIsVisible
      toggleVisibilityKey="ctrl-h"
      changePositionKey="ctrl-q"
      changeMonitorKey="ctrl-m"
    >
      <DevtoolsInspector
        theme={options.theme}
        shouldPersistState
        invertTheme={!options.dark}
        supportImmutable={options.supportImmutable}
        tabs={(defaultTabs) => [
          {
            name: 'Test',
            component: TestGenerator,
          },
          ...defaultTabs,
        ]}
      />
    </DockMonitor>
  );

const ROOT =
  process.env.NODE_ENV === 'production' ? '/redux-devtools-inspector/' : '/';

let DevTools = getDevTools(getOptions());

const reduxRouterMiddleware = routerMiddleware(browserHistory);

const enhancer = compose(
  applyMiddleware(createLogger(), reduxRouterMiddleware),
  (...args) => {
    const useDevtoolsExtension =
      !!window.__REDUX_DEVTOOLS_EXTENSION__ && getOptions().useExtension;
    const instrument = useDevtoolsExtension
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : DevTools.instrument();
    return instrument(...args);
  },
  persistState(getDebugSessionKey())
);

const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
  {},
  enhancer
);

const history = syncHistoryWithStore(browserHistory, store);

const handleRouterUpdate = () => {
  renderApp(getOptions());
};

const router = (
  <Router history={history} onUpdate={handleRouterUpdate}>
    <Route path={ROOT} component={DemoApp} />
  </Router>
);

const renderApp = (options) => {
  DevTools = getDevTools(options);
  const useDevtoolsExtension =
    !!window.__REDUX_DEVTOOLS_EXTENSION__ && options.useExtension;

  return render(
    <Provider store={store}>
      <Container
        themeData={{ theme: 'default', scheme: 'default', light: true }}
      >
        {router}
        {!useDevtoolsExtension && <DevTools />}
      </Container>
    </Provider>,
    document.getElementById('root')
  );
};

renderApp(getOptions());
