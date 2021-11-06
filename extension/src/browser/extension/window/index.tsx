import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { UPDATE_STATE } from '@redux-devtools/app/lib/constants/actionTypes';
import App from '../../../app/containers/App';
import configureStore from '../../../app/stores/windowStore';
import { MonitorMessage } from '../../../app/middlewares/api';

import '../../views/window.pug';

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

  render(
    <Provider store={localStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App position={position} />
      </PersistGate>
    </Provider>,
    document.getElementById('root')
  );
});

if (position !== '#popup') document.body.style.minHeight = '100%';
