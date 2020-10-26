import 'remotedev-monitor-components/lib/presets';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { UPDATE_STATE } from 'remotedev-app/lib/constants/actionTypes';
import App from '../../../app/containers/App';
import configureStore from '../../../app/stores/windowStore';
import getPreloadedState from '../background/getPreloadedState';

const position = location.hash;
let preloadedState;
getPreloadedState(position, state => { preloadedState = state; });

chrome.runtime.getBackgroundPage(({ store }) => {
  const localStore = configureStore(store, position, preloadedState);
  let name = 'monitor';
  if (chrome && chrome.devtools && chrome.devtools.inspectedWindow) name += chrome.devtools.inspectedWindow.tabId;
  const bg = chrome.runtime.connect({ name });
  const update = action => { localStore.dispatch(action || { type: UPDATE_STATE }); };
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
