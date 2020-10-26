import 'remotedev-monitor-components/lib/presets';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { REMOVE_INSTANCE } from 'remotedev-app/lib/constants/actionTypes';
import App from '../../../app/containers/App';
import configureStore from '../../../app/stores/panelStore';
import getPreloadedState from '../background/getPreloadedState';

const position = location.hash;
const messageStyle = { padding: '20px', width: '100%', textAlign: 'center' };

let rendered;
let store;
let bgConnection;
let naTimeout;
let preloadedState;

const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

getPreloadedState(position, state => { preloadedState = state; });

function renderDevTools() {
  const node = document.getElementById('root');
  unmountComponentAtNode(node);
  clearTimeout(naTimeout);
  store = configureStore(position, bgConnection, preloadedState);
  render(
    <Provider store={store}>
      <App position={position} />
    </Provider>,
    node
  );
  rendered = true;
}

function renderNA() {
  if (rendered === false) return;
  rendered = false;
  naTimeout = setTimeout(() => {
    let message = (
      <div style={messageStyle}>
        No store found. Make sure to follow <a href="https://github.com/zalmoxisus/redux-devtools-extension#usage" target="_blank">the instructions</a>.
      </div>
    );
    if (isChrome) {
      chrome.devtools.inspectedWindow.getResources(resources => {
        if (resources[0].url.substr(0, 4) === 'file') {
          message = (
            <div style={messageStyle}>
              No store found. Most likely you did not allow access to file URLs. <a href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#access-file-url-file" target="_blank">See details</a>.
            </div>
          );
        }

        const node = document.getElementById('root');
        unmountComponentAtNode(node);
        render(message, node);
        store = undefined;
      });
    } else {
      const node = document.getElementById('root');
      unmountComponentAtNode(node);
      render(message, node);
      store = undefined;
    }
  }, 3500);
}

function init(id) {
  renderNA();
  bgConnection = chrome.runtime.connect({ name: id ? id.toString() : undefined });
  bgConnection.onMessage.addListener(message => {
    if (message.type === 'NA') {
      if (message.id === id) renderNA();
      else store.dispatch({ type: REMOVE_INSTANCE, id: message.id });
    } else {
      if (!rendered) renderDevTools();
      store.dispatch(message);
    }
  });
}

init(chrome.devtools.inspectedWindow.tabId);
