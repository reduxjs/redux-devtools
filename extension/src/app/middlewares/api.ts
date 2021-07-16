import stringifyJSON from '@redux-devtools/app/lib/utils/stringifyJSON';
import {
  UPDATE_STATE,
  REMOVE_INSTANCE,
  LIFTED_ACTION,
} from '@redux-devtools/app/lib/constants/actionTypes';
import { nonReduxDispatch } from '@redux-devtools/app/lib/utils/monitorActions';
import syncOptions, {
  OptionsMessage,
  SyncOptions,
} from '../../browser/extension/options/syncOptions';
import openDevToolsWindow from '../../browser/extension/background/openWindow';
import { getReport } from '../../browser/extension/background/logging';
import { StoreAction } from '@redux-devtools/app/lib/actions';
import { Dispatch } from 'redux';

interface StartAction {
  readonly type: 'START';
}

interface StopAction {
  readonly type: 'STOP';
}

interface NAAction {
  readonly type: 'NA';
  readonly id: string;
}

interface UpdateStateAction {
  readonly type: typeof UPDATE_STATE;
}

type TabMessage = StartAction | StopAction | OptionsMessage;
type PanelMessage = NAAction;
type MonitorMessage = UpdateStateAction;

type TabPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: TabMessage) => void;
};
type PanelPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: PanelMessage) => void;
};
type MonitorPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: MonitorMessage) => void;
};

const CONNECTED = 'socket/CONNECTED';
const DISCONNECTED = 'socket/DISCONNECTED';
const connections: {
  readonly tab: { [K in number | string]: TabPort };
  readonly panel: { [K in number | string]: PanelPort };
  readonly monitor: { [K in number | string]: MonitorPort };
} = {
  tab: {},
  panel: {},
  monitor: {},
};
const chunks = {};
let monitors = 0;
let isMonitored = false;

const getId = (sender: chrome.runtime.MessageSender, name?: string) =>
  sender.tab ? sender.tab.id! : name || sender.id!;

type MonitorAction = NAAction;

function toMonitors(
  action: MonitorAction,
  tabId?: string | number,
  verbose?: boolean
) {
  Object.keys(connections.monitor).forEach((id) => {
    connections.monitor[id].postMessage(
      verbose || action.type === 'ERROR' ? action : { type: UPDATE_STATE }
    );
  });
  Object.keys(connections.panel).forEach((id) => {
    connections.panel[id].postMessage(action);
  });
}

function toContentScript({ message, action, id, instanceId, state }) {
  connections.tab[id].postMessage({
    type: message,
    action,
    state: nonReduxDispatch(window.store, message, instanceId, action, state),
    id: instanceId.toString().replace(/^[^\/]+\//, ''),
  });
}

function toAllTabs(msg: TabMessage) {
  const tabs = connections.tab;
  Object.keys(tabs).forEach((id) => {
    tabs[id].postMessage(msg);
  });
}

function monitorInstances(shouldMonitor: boolean, id?: string) {
  if (!id && isMonitored === shouldMonitor) return;
  const action = {
    type: shouldMonitor ? ('START' as const) : ('STOP' as const),
  };
  if (id) {
    if (connections.tab[id]) connections.tab[id].postMessage(action);
  } else {
    toAllTabs(action);
  }
  isMonitored = shouldMonitor;
}

function getReducerError() {
  const instancesState = window.store.getState().instances;
  const payload = instancesState.states[instancesState.current];
  const computedState = payload.computedStates[payload.currentStateIndex];
  if (!computedState) return false;
  return computedState.error;
}

function togglePersist() {
  const state = window.store.getState();
  if (state.persistStates) {
    Object.keys(state.instances.connections).forEach((id) => {
      if (connections.tab[id]) return;
      window.store.dispatch({ type: REMOVE_INSTANCE, id });
      toMonitors({ type: 'NA', id });
    });
  }
}

type BackgroundStoreMessage = unknown;
type BackgroundStoreResponse = never;

// Receive messages from content scripts
function messaging(
  request: BackgroundStoreMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: BackgroundStoreResponse) => void
) {
  let tabId = getId(sender);
  if (!tabId) return;
  if (sender.frameId) tabId = `${tabId}-${sender.frameId}`;

  if (request.type === 'STOP') {
    if (!Object.keys(window.store.getState().instances.connections).length) {
      window.store.dispatch({ type: DISCONNECTED });
    }
    return;
  }
  if (request.type === 'OPEN_OPTIONS') {
    chrome.runtime.openOptionsPage();
    return;
  }
  if (request.type === 'GET_OPTIONS') {
    window.syncOptions.get((options) => {
      sendResponse({ options });
    });
    return;
  }
  if (request.type === 'GET_REPORT') {
    getReport(request.payload, tabId, request.instanceId);
    return;
  }
  if (request.type === 'OPEN') {
    let position = 'devtools-left';
    if (
      ['remote', 'panel', 'left', 'right', 'bottom'].indexOf(
        request.position
      ) !== -1
    ) {
      position = 'devtools-' + request.position;
    }
    openDevToolsWindow(position);
    return;
  }
  if (request.type === 'ERROR') {
    if (request.payload) {
      toMonitors(request, tabId);
      return;
    }
    if (!request.message) return;
    const reducerError = getReducerError();
    chrome.notifications.create('app-error', {
      type: 'basic',
      title: reducerError
        ? 'An error occurred in the reducer'
        : 'An error occurred in the app',
      message: reducerError || request.message,
      iconUrl: 'img/logo/48x48.png',
      isClickable: !!reducerError,
    });
    return;
  }

  const action = { type: UPDATE_STATE, request, id: tabId };
  const instanceId = `${tabId}/${request.instanceId}`;
  if (request.split) {
    if (request.split === 'start') {
      chunks[instanceId] = request;
      return;
    }
    if (request.split === 'chunk') {
      chunks[instanceId][request.chunk[0]] =
        (chunks[instanceId][request.chunk[0]] || '') + request.chunk[1];
      return;
    }
    action.request = chunks[instanceId];
    delete chunks[instanceId];
  }
  if (request.instanceId) {
    action.request.instanceId = instanceId;
  }
  window.store.dispatch(action);

  if (request.type === 'EXPORT') {
    toMonitors(action, tabId, true);
  } else {
    toMonitors(action, tabId);
  }
}

function disconnect(
  type: 'tab' | 'monitor' | 'panel',
  id: number | string,
  listener?: (message: any, port: chrome.runtime.Port) => void
) {
  return function disconnectListener() {
    const p = connections[type][id];
    if (listener && p) p.onMessage.removeListener(listener);
    if (p) p.onDisconnect.removeListener(disconnectListener);
    delete connections[type][id];
    if (type === 'tab') {
      if (!window.store.getState().persistStates) {
        window.store.dispatch({ type: REMOVE_INSTANCE, id });
        toMonitors({ type: 'NA', id });
      }
    } else {
      monitors--;
      if (!monitors) monitorInstances(false);
    }
  };
}

function onConnect(port: chrome.runtime.Port) {
  let id: number | string;
  let listener;

  window.store.dispatch({ type: CONNECTED, port });

  if (port.name === 'tab') {
    id = getId(port.sender!);
    if (port.sender!.frameId) id = `${id}-${port.sender!.frameId}`;
    connections.tab[id] = port;
    listener = (msg: TabToBackgroundMessage) => {
      if (msg.name === 'INIT_INSTANCE') {
        if (typeof id === 'number') {
          chrome.pageAction.show(id);
          chrome.pageAction.setIcon({ tabId: id, path: 'img/logo/38x38.png' });
        }
        if (isMonitored) port.postMessage({ type: 'START' });

        const state = window.store.getState();
        if (state.persistStates) {
          const instanceId = `${id}/${msg.instanceId}`;
          const persistedState = state.instances.states[instanceId];
          if (!persistedState) return;
          toContentScript({
            message: 'IMPORT',
            id,
            instanceId,
            state: stringifyJSON(
              persistedState,
              state.instances.options[instanceId].serialize
            ),
          });
        }
        return;
      }
      if (msg.name === 'RELAY') {
        messaging(msg.message, port.sender!, id);
      }
    };
    port.onMessage.addListener(listener);
    port.onDisconnect.addListener(disconnect('tab', id, listener));
  } else if (port.name && port.name.indexOf('monitor') === 0) {
    id = getId(port.sender!, port.name);
    connections.monitor[id] = port;
    monitorInstances(true);
    monitors++;
    port.onDisconnect.addListener(disconnect('monitor', id));
  } else {
    // devpanel
    id = port.name || port.sender!.frameId!;
    connections.panel[id] = port;
    monitorInstances(true, port.name);
    monitors++;
    listener = (msg: StoreAction) => {
      window.store.dispatch(msg);
    };
    port.onMessage.addListener(listener);
    port.onDisconnect.addListener(disconnect('panel', id, listener));
  }
}

chrome.runtime.onConnect.addListener(onConnect);
chrome.runtime.onConnectExternal.addListener(onConnect);
chrome.runtime.onMessage.addListener(messaging);
chrome.runtime.onMessageExternal.addListener(messaging);

chrome.notifications.onClicked.addListener((id) => {
  chrome.notifications.clear(id);
  openDevToolsWindow('devtools-right');
});

declare global {
  interface Window {
    syncOptions: SyncOptions;
  }
}

window.syncOptions = syncOptions(toAllTabs); // Expose to the options page

export default function api() {
  return (next: Dispatch<StoreAction>) => (action: StoreAction) => {
    if (action.type === LIFTED_ACTION) toContentScript(action);
    else if (action.type === 'TOGGLE_PERSIST') togglePersist();
    return next(action);
  };
}
