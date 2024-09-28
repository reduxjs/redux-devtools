import '../chromeApiMock';
import React, { CSSProperties, ReactNode } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Persistor } from 'redux-persist';
import {
  REMOVE_INSTANCE,
  StoreAction,
  StoreState,
  UPDATE_STATE,
} from '@redux-devtools/app';
import App from '../app/App';
import configureStore from './store/panelStore';

import { Action, Store } from 'redux';
import {
  PanelMessageWithoutNA,
  PanelMessageWithSplitAction,
  SplitUpdateStateRequest,
  UpdateStateRequest,
} from '../background/store/apiMiddleware';
import { PersistGate } from 'redux-persist/integration/react';

const position = location.hash;
const messageStyle: CSSProperties = {
  paddingTop: '20px',
  width: '100%',
  textAlign: 'center',
  boxSizing: 'border-box',
};

let rendered: boolean | undefined;
let currentRoot: Root | undefined;
let store: Store<StoreState, StoreAction> | undefined;
let persistor: Persistor | undefined;
let bgConnection: chrome.runtime.Port;
let naTimeout: NodeJS.Timeout;

const isChrome = !navigator.userAgent.includes('Firefox');

function renderNodeAtRoot(node: ReactNode) {
  if (currentRoot) currentRoot.unmount();
  currentRoot = createRoot(document.getElementById('root')!);
  currentRoot.render(node);
}

function renderDevTools() {
  clearTimeout(naTimeout);
  ({ store, persistor } = configureStore(position, bgConnection));
  renderNodeAtRoot(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App position={position} />
      </PersistGate>
    </Provider>,
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
          rel="noreferrer"
        >
          the instructions
        </a>
        .
      </div>
    );
    if (
      isChrome &&
      chrome &&
      chrome.devtools &&
      chrome.devtools.inspectedWindow
    ) {
      chrome.devtools.inspectedWindow.getResources((resources) => {
        if (resources[0].url.substr(0, 4) === 'file') {
          message = (
            <div style={messageStyle}>
              No store found. Most likely you did not allow access to file URLs.{' '}
              <a
                href="https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Troubleshooting.md#access-file-url-file"
                target="_blank"
                rel="noreferrer"
              >
                See details
              </a>
              .
            </div>
          );
        }

        renderNodeAtRoot(message);
        store = undefined;
      });
    } else {
      renderNodeAtRoot(message);
      store = undefined;
    }
  }, 3500);
}

let splitMessage: SplitUpdateStateRequest<unknown, Action<string>>;

function init() {
  renderNA();

  let name = 'monitor';
  if (chrome && chrome.devtools && chrome.devtools.inspectedWindow) {
    name += chrome.devtools.inspectedWindow.tabId;
  }
  bgConnection = chrome.runtime.connect({ name });

  bgConnection.onMessage.addListener(
    <S, A extends Action<string>>(
      message: PanelMessageWithSplitAction<S, A>,
    ) => {
      if (message.type === 'NA') {
        // TODO Double-check this now that the name is different
        if (message.id === name) renderNA();
        else store!.dispatch({ type: REMOVE_INSTANCE, id: message.id });
      } else {
        if (!rendered) renderDevTools();

        if (
          message.type === UPDATE_STATE &&
          (message.request as SplitUpdateStateRequest<S, A>).split
        ) {
          const request = message.request as SplitUpdateStateRequest<S, A>;

          if (request.split === 'start') {
            splitMessage = request;
            return;
          }

          if (request.split === 'chunk') {
            if (
              (splitMessage as unknown as Record<string, string>)[
                request.chunk[0]
              ]
            ) {
              (splitMessage as unknown as Record<string, string>)[
                request.chunk[0]
              ] += request.chunk[1];
            } else {
              (splitMessage as unknown as Record<string, string>)[
                request.chunk[0]
              ] = request.chunk[1];
            }
            return;
          }

          if (request.split === 'end') {
            store!.dispatch({
              ...message,
              request: splitMessage as UpdateStateRequest<S, A>,
            });
            return;
          }

          throw new Error(
            `Unable to process split message with type: ${(request as any).split}`,
          );
        } else {
          store!.dispatch(message as PanelMessageWithoutNA<S, A>);
        }
      }
    },
  );
}

if (position === '#popup') document.body.style.minWidth = '760px';
if (position !== '#popup') document.body.style.minHeight = '100%';

init();
