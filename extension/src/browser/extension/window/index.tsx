import React from 'react';
import { render } from 'react-dom';
import { PreloadedState } from 'redux';
import { Provider } from 'react-redux';
import { UPDATE_STATE } from '@redux-devtools/app/lib/constants/actionTypes';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import App from '../../../app/containers/App';
import configureStore from '../../../app/stores/windowStore';
import getPreloadedState from '../background/getPreloadedState';

import '../../views/window.pug';
import { MonitorMessage } from '../../../app/middlewares/api';

const position = location.hash;
let preloadedState: PreloadedState<StoreState>;
getPreloadedState(position, (state) => {
  preloadedState = state;
});

chrome.runtime.getBackgroundPage((window) => {
  const { store } = window!;
  const localStore = configureStore(store, position, preloadedState);
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
      <App position={position} />
    </Provider>,
    document.getElementById('root')
  );
});

if (position !== '#popup') document.body.style.minHeight = '100%';
