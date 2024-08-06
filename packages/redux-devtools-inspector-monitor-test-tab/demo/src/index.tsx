import React from 'react';
import { createRoot } from 'react-dom/client';
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
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { persistState } from '@redux-devtools/core';
import DemoApp from './DemoApp';
import { rootReducer } from './reducers';
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

const useDevtoolsExtension =
  !!(window as unknown as { __REDUX_DEVTOOLS_EXTENSION__: unknown }) &&
  getOptions(window.location).useExtension;

const enhancer: StoreEnhancer = compose(
  applyMiddleware(logger),
  ((next) => {
    const instrument = useDevtoolsExtension
      ? (
          window as unknown as {
            __REDUX_DEVTOOLS_EXTENSION__(): StoreEnhancer;
          }
        ).__REDUX_DEVTOOLS_EXTENSION__()
      : DevTools.instrument();
    return instrument(next);
  }) as StoreEnhancer,
  persistState(getDebugSessionKey()),
) as any;

const store = createStore(rootReducer, enhancer);

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Container
        themeData={{
          theme: 'default',
          scheme: 'default',
          colorPreference: 'auto',
        }}
      >
        <Routes>
          <Route path={ROOT} element={<DemoApp />} />
        </Routes>
        {!useDevtoolsExtension && <ConnectedDevTools />}
      </Container>
    </BrowserRouter>
  </Provider>,
);
