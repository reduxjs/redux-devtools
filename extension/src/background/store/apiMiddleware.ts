import {
  CustomAction,
  DispatchAction as AppDispatchAction,
  LibConfig,
  LIFTED_ACTION,
  nonReduxDispatch,
  REMOVE_INSTANCE,
  SET_PERSIST,
  SetPersistAction,
  stringifyJSON,
  TOGGLE_PERSIST,
  UPDATE_STATE,
} from '@redux-devtools/app';
import syncOptions, {
  Options,
  OptionsMessage,
  SyncOptions,
} from '../../options/syncOptions';
import openDevToolsWindow, { DevToolsPosition } from '../openWindow';
import { getReport } from '../logging';
import { Action, Dispatch, Middleware } from 'redux';
import type {
  ContentScriptToBackgroundMessage,
  SplitMessage,
} from '../../contentScript';
import type {
  ErrorMessage,
  PageScriptToContentScriptMessageForwardedToMonitors,
  PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance,
} from '../../pageScript/api';
import { LiftedState } from '@redux-devtools/instrument';
import type { BackgroundAction, LiftedActionAction } from './backgroundStore';
import type { Position } from '../../pageScript/api/openWindow';
import type { BackgroundState } from './backgroundReducer';

interface TabMessageBase {
  readonly type: string;
  readonly state?: string | undefined;
  readonly id?: string;
}

interface StartAction extends TabMessageBase {
  readonly type: 'START';
  readonly state?: never;
  readonly id?: never;
}

interface StopAction extends TabMessageBase {
  readonly type: 'STOP';
  readonly state?: never;
  readonly id?: never;
}

interface DispatchAction extends TabMessageBase {
  readonly type: 'DISPATCH';
  readonly action: AppDispatchAction;
  readonly state: string | undefined;
  readonly id: string;
}

interface ImportAction extends TabMessageBase {
  readonly type: 'IMPORT';
  readonly action: undefined;
  readonly state: string | undefined;
  readonly id: string;
}

interface ActionAction extends TabMessageBase {
  readonly type: 'ACTION';
  readonly action: string | CustomAction;
  readonly state: string | undefined;
  readonly id: string;
}

interface ExportAction extends TabMessageBase {
  readonly type: 'EXPORT';
  readonly action: undefined;
  readonly state: string | undefined;
  readonly id: string;
}

export interface NAAction {
  readonly type: 'NA';
  readonly id: string | number;
}

interface InitMessage<S, A extends Action<string>> {
  readonly type: 'INIT';
  readonly payload: string;
  instanceId: string;
  readonly source: '@devtools-page';
  action?: string;
  name?: string | undefined;
  liftedState?: LiftedState<S, A, unknown>;
  libConfig?: LibConfig;
}

interface LiftedMessage {
  type: 'LIFTED';
  liftedState: { isPaused: boolean | undefined };
  instanceId: number;
  source: '@devtools-page';
}

interface SerializedPartialLiftedState {
  readonly stagedActionIds: readonly number[];
  readonly currentStateIndex: number;
  readonly nextActionId: number;
}

interface SerializedPartialStateMessage {
  readonly type: 'PARTIAL_STATE';
  readonly payload: SerializedPartialLiftedState;
  readonly source: '@devtools-page';
  instanceId: number;
  readonly maxAge: number;
  readonly actionsById: string;
  readonly computedStates: string;
  readonly committedState: boolean;
}

interface SerializedExportMessage {
  readonly type: 'EXPORT';
  readonly payload: string;
  readonly committedState: string | undefined;
  readonly source: '@devtools-page';
  instanceId: number;
}

interface SerializedActionMessage {
  readonly type: 'ACTION';
  readonly payload: string;
  readonly source: '@devtools-page';
  instanceId: number;
  readonly action: string;
  readonly maxAge: number;
  readonly nextActionId: number;
}

interface SerializedStateMessage<S, A extends Action<string>> {
  readonly type: 'STATE';
  readonly payload: Omit<
    LiftedState<S, A, unknown>,
    'actionsById' | 'computedStates' | 'committedState'
  >;
  readonly source: '@devtools-page';
  instanceId: string;
  readonly libConfig?: LibConfig;
  readonly actionsById: string;
  readonly computedStates: string;
  readonly committedState: boolean;
}

export type UpdateStateRequest<S, A extends Action<string>> =
  | InitMessage<S, A>
  | LiftedMessage
  | SerializedPartialStateMessage
  | SerializedExportMessage
  | SerializedActionMessage
  | SerializedStateMessage<S, A>;

export interface EmptyUpdateStateAction {
  readonly type: typeof UPDATE_STATE;
}

interface UpdateStateAction<S, A extends Action<string>> {
  readonly type: typeof UPDATE_STATE;
  request: UpdateStateRequest<S, A>;
  readonly id: string | number;
}

type SplitUpdateStateRequestStart<S, A extends Action<string>> = {
  split: 'start';
} & Partial<UpdateStateRequest<S, A>>;

interface SplitUpdateStateRequestChunk {
  readonly split: 'chunk';
  readonly chunk: [string, string];
}

interface SplitUpdateStateRequestEnd {
  readonly split: 'end';
}

export type SplitUpdateStateRequest<S, A extends Action<string>> =
  | SplitUpdateStateRequestStart<S, A>
  | SplitUpdateStateRequestChunk
  | SplitUpdateStateRequestEnd;

interface SplitUpdateStateAction<S, A extends Action<string>> {
  readonly type: typeof UPDATE_STATE;
  request: SplitUpdateStateRequest<S, A>;
  readonly id: string | number;
}

export type TabMessage =
  | StartAction
  | StopAction
  | OptionsMessage
  | DispatchAction
  | ImportAction
  | ActionAction
  | ExportAction;
export type PanelMessageWithoutNA<S, A extends Action<string>> =
  | ErrorMessage
  | UpdateStateAction<S, A>
  | SetPersistAction;
export type PanelMessage<S, A extends Action<string>> =
  | PanelMessageWithoutNA<S, A>
  | NAAction;
export type PanelMessageWithSplitAction<S, A extends Action<string>> =
  | PanelMessage<S, A>
  | SplitUpdateStateAction<S, A>;
export type MonitorMessage =
  | NAAction
  | ErrorMessage
  | EmptyUpdateStateAction
  | SetPersistAction;

type TabPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: TabMessage) => void;
};
type PanelPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: <S, A extends Action<string>>(
    message: PanelMessageWithSplitAction<S, A>,
  ) => void;
};
type MonitorPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: MonitorMessage) => void;
};

export const CONNECTED = 'socket/CONNECTED';
export const DISCONNECTED = 'socket/DISCONNECTED';
const connections: {
  readonly tab: { [K in number | string]: TabPort };
  readonly panel: { [K in number | string]: PanelPort };
  readonly monitor: { [K in number | string]: MonitorPort };
} = {
  tab: {},
  panel: {},
  monitor: {},
};
const chunks: {
  [instanceId: string]: PageScriptToContentScriptMessageForwardedToMonitors<
    unknown,
    Action<string>
  >;
} = {};
let monitors = 0;
let isMonitored = false;

const getId = (sender: chrome.runtime.MessageSender, name?: string) =>
  sender.tab ? sender.tab.id! : name || sender.id!;

type MonitorAction<S, A extends Action<string>> =
  | NAAction
  | ErrorMessage
  | UpdateStateAction<S, A>
  | SetPersistAction;

// Chrome message limit is 64 MB, but we're using 32 MB to include other object's parts
const maxChromeMsgSize = 32 * 1024 * 1024;

function toMonitors<S, A extends Action<string>>(
  action: MonitorAction<S, A>,
  tabId?: string | number,
  verbose?: boolean,
) {
  for (const monitorPort of Object.values(connections.monitor)) {
    monitorPort.postMessage(
      verbose || action.type === 'ERROR' || action.type === SET_PERSIST
        ? action
        : { type: UPDATE_STATE },
    );
  }

  for (const panelPort of Object.values(connections.panel)) {
    try {
      panelPort.postMessage(action);
    } catch (err) {
      if (
        action.type !== UPDATE_STATE ||
        err == null ||
        (err as Error).message !==
          'Message length exceeded maximum allowed length.'
      ) {
        throw err;
      }

      const splitMessageStart: SplitUpdateStateRequestStart<S, A> = {
        split: 'start',
      };
      const toSplit: [string, string][] = [];
      let size = 0;
      for (const [key, value] of Object.entries(
        action.request as unknown as Record<string, unknown>,
      )) {
        if (typeof value === 'string') {
          size += value.length;
          if (size > maxChromeMsgSize) {
            toSplit.push([key, value]);
            continue;
          }
        }

        (splitMessageStart as any)[key as keyof typeof splitMessageStart] =
          value;
      }

      panelPort.postMessage({ ...action, request: splitMessageStart });

      for (let i = 0; i < toSplit.length; i++) {
        for (let j = 0; j < toSplit[i][1].length; j += maxChromeMsgSize) {
          panelPort.postMessage({
            ...action,
            request: {
              split: 'chunk',
              chunk: [
                toSplit[i][0],
                toSplit[i][1].substring(j, j + maxChromeMsgSize),
              ],
            },
          });
        }
      }

      panelPort.postMessage({ ...action, request: { split: 'end' } });
    }
  }
}

interface ImportMessage {
  readonly message: 'IMPORT';
  readonly id: string | number;
  readonly instanceId: string;
  readonly state: string;
  readonly action?: never;
}

type ToContentScriptMessage = ImportMessage | LiftedActionAction;

function toContentScript(messageBody: ToContentScriptMessage) {
  if (messageBody.message === 'DISPATCH') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        window.store,
        message,
        instanceId,
        action as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^\/]+\//, ''),
    });
  } else if (messageBody.message === 'IMPORT') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        window.store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^\/]+\//, ''),
    });
  } else if (messageBody.message === 'ACTION') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        window.store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^\/]+\//, ''),
    });
  } else if (messageBody.message === 'EXPORT') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        window.store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^\/]+\//, ''),
    });
  } else {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        window.store,
        message,
        instanceId,
        action as AppDispatchAction,
        state,
      ),
      id: (instanceId as number).toString().replace(/^[^\/]+\//, ''),
    });
  }
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
  if (state.instances.persisted) {
    Object.keys(state.instances.connections).forEach((id) => {
      if (connections.tab[id]) return;
      window.store.dispatch({ type: REMOVE_INSTANCE, id });
      toMonitors({ type: 'NA', id });
    });
  }
}

interface OpenMessage {
  readonly type: 'OPEN';
  readonly position: Position;
}

interface OpenOptionsMessage {
  readonly type: 'OPEN_OPTIONS';
}

interface GetOptionsMessage {
  readonly type: 'GET_OPTIONS';
}

export type SingleMessage =
  | OpenMessage
  | OpenOptionsMessage
  | GetOptionsMessage;

type BackgroundStoreMessage<S, A extends Action<string>> =
  | PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance<S, A>
  | SplitMessage
  | SingleMessage;
type BackgroundStoreResponse = { readonly options: Options };

// Receive messages from content scripts
function messaging<S, A extends Action<string>>(
  request: BackgroundStoreMessage<S, A>,
  sender: chrome.runtime.MessageSender,
  sendResponse?: (response?: BackgroundStoreResponse) => void,
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
      sendResponse!({ options });
    });
    return;
  }
  if (request.type === 'GET_REPORT') {
    getReport(request.payload, tabId, request.instanceId);
    return;
  }
  if (request.type === 'OPEN') {
    let position: DevToolsPosition = 'devtools-left';
    if (
      ['remote', 'panel', 'left', 'right', 'bottom'].indexOf(
        request.position,
      ) !== -1
    ) {
      position = ('devtools-' + request.position) as DevToolsPosition;
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

  const action: UpdateStateAction<S, A> = {
    type: UPDATE_STATE,
    request,
    id: tabId,
  } as UpdateStateAction<S, A>;
  const instanceId = `${tabId}/${request.instanceId}`;
  if ('split' in request) {
    if (request.split === 'start') {
      chunks[instanceId] = request as any;
      return;
    }
    if (request.split === 'chunk') {
      (chunks[instanceId] as any)[request.chunk[0]] =
        ((chunks[instanceId] as any)[request.chunk[0]] || '') +
        request.chunk[1];
      return;
    }
    action.request = chunks[instanceId] as any;
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
  listener?: (message: any, port: chrome.runtime.Port) => void,
) {
  return function disconnectListener() {
    const p = connections[type][id];
    if (listener && p) p.onMessage.removeListener(listener);
    if (p) p.onDisconnect.removeListener(disconnectListener);
    delete connections[type][id];
    if (type === 'tab') {
      if (!window.store.getState().instances.persisted) {
        window.store.dispatch({ type: REMOVE_INSTANCE, id });
        toMonitors({ type: 'NA', id });
      }
    } else {
      monitors--;
      if (!monitors) monitorInstances(false);
    }
  };
}

function onConnect<S, A extends Action<string>>(port: chrome.runtime.Port) {
  let id: number | string;
  let listener;

  window.store.dispatch({ type: CONNECTED, port });

  if (port.name === 'tab') {
    id = getId(port.sender!);
    if (port.sender!.frameId) id = `${id}-${port.sender!.frameId}`;
    connections.tab[id] = port;
    listener = (msg: ContentScriptToBackgroundMessage<S, A>) => {
      if (msg.name === 'INIT_INSTANCE') {
        if (typeof id === 'number') {
          chrome.pageAction.show(id);
          chrome.pageAction.setIcon({ tabId: id, path: 'img/logo/38x38.png' });
        }
        if (isMonitored) port.postMessage({ type: 'START' });

        const state = window.store.getState();
        if (state.instances.persisted) {
          const instanceId = `${id}/${msg.instanceId}`;
          const persistedState = state.instances.states[instanceId];
          if (!persistedState) return;
          toContentScript({
            message: 'IMPORT',
            id,
            instanceId,
            state: stringifyJSON(
              persistedState,
              state.instances.options[instanceId].serialize,
            ),
          });
        }
        return;
      }
      if (msg.name === 'RELAY') {
        messaging(msg.message, port.sender!);
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
    listener = (msg: BackgroundAction) => {
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

const api: Middleware<{}, BackgroundState, Dispatch<BackgroundAction>> =
  (store) => (next) => (untypedAction) => {
    const action = untypedAction as BackgroundAction;

    if (action.type === LIFTED_ACTION) toContentScript(action);
    else if (action.type === TOGGLE_PERSIST) {
      togglePersist();
      toMonitors({
        type: SET_PERSIST,
        payload: !store.getState().instances.persisted,
      });
    }
    return next(action);
  };

export default api;
