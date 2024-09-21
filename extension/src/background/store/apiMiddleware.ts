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
import type { Options, OptionsMessage } from '../../options/syncOptions';
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
import { store } from '../index';

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

interface OptionsAction {
  readonly type: 'OPTIONS';
  readonly options: Options;
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
  | OptionsAction
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

type TabPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: (message: TabMessage) => void;
};
type PanelPort = Omit<chrome.runtime.Port, 'postMessage'> & {
  postMessage: <S, A extends Action<string>>(
    message: PanelMessageWithSplitAction<S, A>,
  ) => void;
};

export const CONNECTED = 'socket/CONNECTED';
export const DISCONNECTED = 'socket/DISCONNECTED';
const connections: {
  readonly tab: { [K in number | string]: TabPort };
  readonly panel: { [K in number | string]: PanelPort };
} = {
  tab: {},
  panel: {},
};
const chunks: {
  [instanceId: string]: PageScriptToContentScriptMessageForwardedToMonitors<
    unknown,
    Action<string>
  >;
} = {};
let monitors = 0;

const getId = (sender: chrome.runtime.MessageSender, name?: string) =>
  sender.tab ? sender.tab.id! : name || sender.id!;

type MonitorAction<S, A extends Action<string>> =
  | NAAction
  | ErrorMessage
  | UpdateStateAction<S, A>
  | SetPersistAction;

// Chrome message limit is 64 MB, but we're using 32 MB to include other object's parts
const maxChromeMsgSize = 32 * 1024 * 1024;

function toMonitors<S, A extends Action<string>>(action: MonitorAction<S, A>) {
  console.log(`Message to monitors: ${action.type}`);

  for (const port of Object.values(connections.panel)) {
    try {
      port.postMessage(action);
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

      port.postMessage({ ...action, request: splitMessageStart });

      for (let i = 0; i < toSplit.length; i++) {
        for (let j = 0; j < toSplit[i][1].length; j += maxChromeMsgSize) {
          port.postMessage({
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

      port.postMessage({ ...action, request: { split: 'end' } });
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
  console.log(`Message to tab ${messageBody.id}: ${messageBody.message}`);

  if (messageBody.message === 'DISPATCH') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(store, message, instanceId, action, state),
      id: instanceId.toString().replace(/^[^/]+\//, ''),
    });
  } else if (messageBody.message === 'IMPORT') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^/]+\//, ''),
    });
  } else if (messageBody.message === 'ACTION') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^/]+\//, ''),
    });
  } else if (messageBody.message === 'EXPORT') {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id!].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        store,
        message,
        instanceId,
        action as unknown as AppDispatchAction,
        state,
      ),
      id: instanceId.toString().replace(/^[^/]+\//, ''),
    });
  } else {
    const { message, action, id, instanceId, state } = messageBody;
    connections.tab[id].postMessage({
      type: message,
      action,
      state: nonReduxDispatch(
        store,
        message,
        instanceId,
        action as AppDispatchAction,
        state,
      ),
      id: (instanceId as number).toString().replace(/^[^/]+\//, ''),
    });
  }
}

function toAllTabs(msg: TabMessage) {
  console.log(`Message to all tabs: ${msg.type}`);

  for (const tabPort of Object.values(connections.tab)) {
    tabPort.postMessage(msg);
  }
}

function getReducerError() {
  const instancesState = store.getState().instances;
  const payload = instancesState.states[instancesState.current];
  const computedState = payload.computedStates[payload.currentStateIndex];
  if (!computedState) return false;
  return computedState.error;
}

function togglePersist() {
  const state = store.getState();
  if (state.instances.persisted) {
    for (const id of Object.keys(state.instances.connections)) {
      if (connections.tab[id]) return;
      store.dispatch({ type: REMOVE_INSTANCE, id });
      toMonitors({ type: 'NA', id });
    }
  }
}

interface OpenMessage {
  readonly type: 'OPEN';
  readonly position: Position;
}

interface OpenOptionsMessage {
  readonly type: 'OPEN_OPTIONS';
}

export type SingleMessage = OpenMessage | OpenOptionsMessage | OptionsMessage;

type BackgroundStoreMessage<S, A extends Action<string>> =
  | PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance<S, A>
  | SplitMessage
  | SingleMessage;

// Receive messages from content scripts
function messaging<S, A extends Action<string>>(
  request: BackgroundStoreMessage<S, A>,
  sender: chrome.runtime.MessageSender,
) {
  let tabId = getId(sender);
  console.log(`Message from tab ${tabId}: ${request.type ?? request.split}`);
  if (!tabId) return;
  if (sender.frameId) tabId = `${tabId}-${sender.frameId}`;

  if (request.type === 'STOP') {
    if (!Object.keys(store.getState().instances.connections).length) {
      store.dispatch({ type: DISCONNECTED });
    }
    return;
  }
  if (request.type === 'OPEN_OPTIONS') {
    void chrome.runtime.openOptionsPage();
    return;
  }
  if (request.type === 'OPTIONS') {
    toAllTabs({ type: 'OPTIONS', options: request.options });
    return;
  }
  if (request.type === 'GET_REPORT') {
    getReport(request.payload, tabId, request.instanceId);
    return;
  }
  if (request.type === 'OPEN') {
    let position: DevToolsPosition = 'devtools-window';
    if (['remote', 'window'].includes(request.position)) {
      position = ('devtools-' + request.position) as DevToolsPosition;
    }
    openDevToolsWindow(position);
    return;
  }
  if (request.type === 'ERROR') {
    if (request.payload) {
      toMonitors(request);
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
  store.dispatch(action);

  toMonitors(action);
}

function disconnect(
  type: 'tab' | 'panel',
  id: number | string,
  listener: (message: any, port: chrome.runtime.Port) => void,
) {
  return function disconnectListener() {
    console.log(`Disconnected from ${type} ${id}`);

    const p = connections[type][id];
    if (listener && p) p.onMessage.removeListener(listener);
    if (p) p.onDisconnect.removeListener(disconnectListener);
    delete connections[type][id];
    if (type === 'tab') {
      if (!store.getState().instances.persisted) {
        store.dispatch({ type: REMOVE_INSTANCE, id });
        toMonitors({ type: 'NA', id });
      }
    } else {
      monitors--;
      if (monitors === 0) toAllTabs({ type: 'STOP' });
    }
  };
}

function onConnect<S, A extends Action<string>>(port: chrome.runtime.Port) {
  let id: number | string;
  let listener;

  store.dispatch({ type: CONNECTED, port });

  if (port.name === 'tab') {
    id = getId(port.sender!);
    console.log(`Connected to tab ${id}`);
    if (port.sender!.frameId) id = `${id}-${port.sender!.frameId}`;
    connections.tab[id] = port;
    listener = (msg: ContentScriptToBackgroundMessage<S, A>) => {
      console.log(`Message from tab ${id}: ${msg.name}`);
      if (msg.name === 'INIT_INSTANCE') {
        if (typeof id === 'number') {
          void chrome.action.enable(id);
          void chrome.action.setIcon({ tabId: id, path: 'img/logo/38x38.png' });
        }
        if (monitors > 0) port.postMessage({ type: 'START' });

        const state = store.getState();
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
    // devpanel
    id = getId(port.sender!, port.name);
    console.log(`Connected to monitor ${id}`);
    connections.panel[id] = port;
    monitors++;
    toAllTabs({ type: 'START' });
    listener = (msg: BackgroundAction) => {
      console.log(`Message from monitor ${id}: ${msg.type}`);
      store.dispatch(msg);
    };
    port.onMessage.addListener(listener);
    port.onDisconnect.addListener(disconnect('panel', id, listener));

    const { current } = store.getState().instances;
    if (current !== 'default') {
      const connectionId = Object.entries(
        store.getState().instances.connections,
      ).find(([, instanceIds]) => instanceIds.includes(current))?.[0];
      const options = store.getState().instances.options[current];
      const state = store.getState().instances.states[current];
      const { actionsById, computedStates, committedState, ...rest } = state;
      toMonitors({
        type: UPDATE_STATE,
        request: {
          type: 'STATE',
          payload: rest as Omit<
            LiftedState<S, A, unknown>,
            'actionsById' | 'computedStates' | 'committedState'
          >,
          source: '@devtools-page',
          instanceId:
            typeof current === 'number' ? current.toString() : current,
          actionsById: stringifyJSON(actionsById, options.serialize),
          computedStates: stringifyJSON(computedStates, options.serialize),
          committedState: typeof committedState !== 'undefined',
        },
        id: connectionId ?? current,
      });
    }
  }
}

chrome.runtime.onConnect.addListener(onConnect);
chrome.runtime.onConnectExternal.addListener(onConnect);
chrome.runtime.onMessage.addListener(messaging);
chrome.runtime.onMessageExternal.addListener(messaging);

chrome.notifications.onClicked.addListener((id) => {
  chrome.notifications.clear(id);
  openDevToolsWindow('devtools-window');
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
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
