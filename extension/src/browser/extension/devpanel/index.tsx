import React, { CSSProperties } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';
import { REMOVE_INSTANCE } from '@redux-devtools/app/lib/constants/actionTypes';
import App from '../../../app/containers/App';
import configureStore from '../../../app/stores/panelStore';

import '../../views/devpanel.pug';
import { Action, Store } from 'redux';
import { StoreAction } from '@redux-devtools/app/lib/actions';
import { PanelMessage } from '../../../app/middlewares/api';
import { StoreStateWithoutSocket } from '../../../app/reducers/panel';
import { PersistGate } from 'redux-persist/integration/react';

const position = location.hash;
const messageStyle: CSSProperties = {
  padding: '20px',
  width: '100%',
  textAlign: 'center',
};

let rendered: boolean | undefined;
let store: Store<StoreStateWithoutSocket, StoreAction> | undefined;
let persistor: Persistor | undefined;
let bgConnection: chrome.runtime.Port;
let naTimeout: NodeJS.Timeout;

const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

function renderDevTools() {
  const node = document.getElementById('root');
  unmountComponentAtNode(node!);
  clearTimeout(naTimeout);
  ({ store, persistor } = configureStore(position, bgConnection));
  render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App position={position} />
      </PersistGate>
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
        No store found. Make sure to follow{' '}
        <a
          href="https://github.com/zalmoxisus/redux-devtools-extension#usage"
          target="_blank"
        >
          the instructions
        </a>
        .
      </div>
    );
    if (isChrome) {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        if (resources[0].url.substr(0, 4) === 'file') {
          message = (
            <div style={messageStyle}>
              No store found. Most likely you did not allow access to file URLs.{' '}
              <a
                href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#access-file-url-file"
                target="_blank"
              >
                See details
              </a>
              .
            </div>
          );
        }

        const node = document.getElementById('root');
        unmountComponentAtNode(node!);
        render(message, node);
        store = undefined;
      });
    } else {
      const node = document.getElementById('root');
      unmountComponentAtNode(node!);
      render(message, node);
      store = undefined;
    }
  }, 3500);
}

function init(id: number) {
  renderNA();
  bgConnection = chrome.runtime.connect({
    name: id ? id.toString() : undefined,
  });
  bgConnection.onMessage.addListener(
    <S, A extends Action<unknown>>(message: PanelMessage<S, A>) => {
      if (message.type === 'NA') {
        if (message.id === id) renderNA();
        else store!.dispatch({ type: REMOVE_INSTANCE, id: message.id });
      } else {
        if (!rendered) renderDevTools();
        store!.dispatch(message);
      }
    }
  );
}

init(chrome.devtools.inspectedWindow.tabId);
