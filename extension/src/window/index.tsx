import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { UPDATE_STATE } from '@redux-devtools/app';
import App from '../app/App';
import configureStore from './store/windowStore';
import type { MonitorMessage } from '../background/store/apiMiddleware';

const position = location.hash;

chrome.runtime.getBackgroundPage((window) => {
  const { store } = window!;
  const { store: localStore, persistor } = configureStore(store, position);
  let name = 'monitor';
  if (chrome && chrome.devtools && chrome.devtools.inspectedWindow) {
    name += chrome.devtools.inspectedWindow.tabId;
  }
  const bg = chrome.runtime.connect({ name });
  const update = (action?: MonitorMessage) => {
    localStore.dispatch(action || { type: UPDATE_STATE });
  };
  bg.onMessage.addListener(update);
  update();

  const root = createRoot(document.getElementById('root')!);
  root.render(
    <Provider store={localStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App position={position} />
      </PersistGate>
    </Provider>,
  );
});

if (position === '#popup') document.body.style.minWidth = '760px';
if (position !== '#popup') document.body.style.minHeight = '100%';
