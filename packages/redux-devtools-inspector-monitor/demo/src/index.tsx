import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createStore,
  applyMiddleware,
  compose,
  StoreEnhancerStoreCreator,
  StoreEnhancer,
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
    ? '/redux-devtools-inspector-monitor/'
    : '/';

const DevTools = getDevTools(window.location);

const useDevtoolsExtension =
  !!(window as unknown as { __REDUX_DEVTOOLS_EXTENSION__: unknown })
    .__REDUX_DEVTOOLS_EXTENSION__ && getOptions(window.location).useExtension;

const enhancer: StoreEnhancer = compose(
  applyMiddleware(logger),
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
  persistState(getDebugSessionKey()),
) as any;

const store = createStore(rootReducer, enhancer);

const root = createRoot(document.getElementById('root')!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path={ROOT} element={<DemoApp />} />
      </Routes>
      {!useDevtoolsExtension && <ConnectedDevTools />}
    </BrowserRouter>
  </Provider>,
);
