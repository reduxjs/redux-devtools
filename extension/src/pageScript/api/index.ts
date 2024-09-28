import jsan, { Options } from 'jsan';
import { throttle } from 'lodash-es';
import { immutableSerialize } from '@redux-devtools/serialize';
import { getActionsArray, getLocalFilter } from '@redux-devtools/utils';
import { isFiltered, PartialLiftedState } from './filters';
import importState from './importState';
import generateId from './generateInstanceId';
import type { Config } from '../index';
import { Action } from 'redux';
import { LiftedState, PerformAction } from '@redux-devtools/instrument';
import { LibConfig } from '@redux-devtools/app';
import type {
  ContentScriptToPageScriptMessage,
  ListenerMessage,
} from '../../contentScript';
import type { Position } from './openWindow';

const listeners: {
  [instanceId: string]:
    | ((message: ContentScriptToPageScriptMessage) => void)
    | ((message: ContentScriptToPageScriptMessage) => void)[];
} = {};
export const source = '@devtools-page';

function windowReplacer(key: string, value: unknown) {
  if (value && (value as Window).window === value) {
    return '[WINDOW]';
  }
  return value;
}

function tryCatchStringify(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') {
      console.log('Failed to stringify', err);
    }
    /* eslint-enable no-console */
    return jsan.stringify(obj, windowReplacer, undefined, {
      circular: '[CIRCULAR]',
      date: true,
    });
  }
}

let stringifyWarned: boolean;
function stringify(obj: unknown, serialize?: Serialize | undefined) {
  const str =
    typeof serialize === 'undefined'
      ? tryCatchStringify(obj)
      : jsan.stringify(obj, serialize.replacer, undefined, serialize.options);

  if (!stringifyWarned && str && str.length > 16 * 1024 * 1024) {
    // 16 MB
    /* eslint-disable no-console */
    console.warn(
      'Application state or actions payloads are too large making Redux DevTools serialization slow and consuming a lot of memory. See https://github.com/reduxjs/redux-devtools-extension/blob/master/docs/Troubleshooting.md#excessive-use-of-memory-and-cpu on how to configure it.',
    );
    /* eslint-enable no-console */
    stringifyWarned = true;
  }

  return str;
}

export interface Serialize {
  readonly replacer?: (key: string, value: unknown) => unknown;
  readonly reviver?: (key: string, value: unknown) => unknown;
  readonly options?: Options | boolean;
}

export function getSerializeParameter(config: Config) {
  const serialize = config.serialize;
  if (serialize) {
    if (serialize === true) return { options: true };
    if (serialize.immutable) {
      const immutableSerializer = immutableSerialize(
        serialize.immutable,
        serialize.refs,
        serialize.replacer,
        serialize.reviver,
      );
      return {
        replacer: immutableSerializer.replacer,
        reviver: immutableSerializer.reviver,
        options:
          typeof serialize.options === 'object'
            ? { ...immutableSerializer.options, ...serialize.options }
            : immutableSerializer.options,
      };
    }
    if (!serialize.replacer && !serialize.reviver) {
      return { options: serialize.options };
    }
    return {
      replacer: serialize.replacer,
      reviver: serialize.reviver,
      options: serialize.options || true,
    };
  }

  return undefined;
}

interface InitInstancePageScriptToContentScriptMessage {
  readonly type: 'INIT_INSTANCE';
  readonly instanceId: number;
  readonly source: typeof source;
}

interface DisconnectMessage {
  readonly type: 'DISCONNECT';
  readonly source: typeof source;
}

interface InitMessage<S, A extends Action<string>> {
  readonly type: 'INIT';
  readonly payload: string;
  readonly instanceId: number;
  readonly source: typeof source;
  action?: string;
  name?: string | undefined;
  liftedState?: LiftedState<S, A, unknown>;
  libConfig?: LibConfig;
}

interface SerializedPartialLiftedState {
  readonly stagedActionIds: readonly number[];
  readonly currentStateIndex: number;
  readonly nextActionId: number;
}

interface SerializedPartialStateMessage {
  readonly type: 'PARTIAL_STATE';
  readonly payload: SerializedPartialLiftedState;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly maxAge: number;
  readonly actionsById: string;
  readonly computedStates: string;
  readonly committedState: boolean;
}

interface SerializedExportMessage {
  readonly type: 'EXPORT';
  readonly payload: string;
  readonly committedState: string | undefined;
  readonly source: typeof source;
  readonly instanceId: number;
}

interface SerializedActionMessage {
  readonly type: 'ACTION';
  readonly payload: string;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly action: string;
  readonly maxAge: number;
  readonly nextActionId?: number;
}

interface SerializedStateMessage<S, A extends Action<string>> {
  readonly type: 'STATE';
  readonly payload: Omit<
    LiftedState<S, A, unknown>,
    'actionsById' | 'computedStates' | 'committedState'
  >;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly libConfig?: LibConfig;
  readonly actionsById: string;
  readonly computedStates: string;
  readonly committedState: boolean;
}

interface OpenMessage {
  readonly source: typeof source;
  readonly type: 'OPEN';
  readonly position: Position;
}

export type PageScriptToContentScriptMessageForwardedToMonitors<
  S,
  A extends Action<string>,
> =
  | InitMessage<S, A>
  | LiftedMessage
  | SerializedPartialStateMessage
  | SerializedExportMessage
  | SerializedActionMessage
  | SerializedStateMessage<S, A>;

export type PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance<
  S,
  A extends Action<string>,
> =
  | PageScriptToContentScriptMessageForwardedToMonitors<S, A>
  | ErrorMessage
  | GetReportMessage
  | StopMessage
  | OpenMessage;

export type PageScriptToContentScriptMessageWithoutDisconnect<
  S,
  A extends Action<string>,
> =
  | PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance<S, A>
  | InitInstancePageScriptToContentScriptMessage
  | InitInstanceMessage;

export type PageScriptToContentScriptMessage<S, A extends Action<string>> =
  | PageScriptToContentScriptMessageWithoutDisconnect<S, A>
  | DisconnectMessage;

function post<S, A extends Action<string>>(
  message: PageScriptToContentScriptMessage<S, A>,
) {
  window.postMessage(message, '*');
}

function getStackTrace(
  config: Config,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  toExcludeFromTrace: Function | undefined,
) {
  if (!config.trace) return undefined;
  if (typeof config.trace === 'function') return config.trace();

  let stack;
  let extraFrames = 0;
  let prevStackTraceLimit;
  const traceLimit = config.traceLimit;
  const error = Error();
  if (Error.captureStackTrace) {
    if (Error.stackTraceLimit < traceLimit!) {
      prevStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = traceLimit!;
    }
    Error.captureStackTrace(error, toExcludeFromTrace);
  } else {
    extraFrames = 3;
  }
  stack = error.stack;
  if (prevStackTraceLimit) Error.stackTraceLimit = prevStackTraceLimit;
  if (
    extraFrames ||
    typeof Error.stackTraceLimit !== 'number' ||
    Error.stackTraceLimit > traceLimit!
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const frames = stack!.split('\n');
    if (frames.length > traceLimit!) {
      stack = frames
        .slice(0, traceLimit! + extraFrames + (frames[0] === 'Error' ? 1 : 0))
        .join('\n');
    }
  }
  return stack;
}

function amendActionType<A extends Action<string>>(
  action:
    | A
    | StructuralPerformAction<A>
    | StructuralPerformAction<A>[]
    | string,
  config: Config,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  toExcludeFromTrace: Function | undefined,
): StructuralPerformAction<A> {
  const timestamp = Date.now();
  const stack = getStackTrace(config, toExcludeFromTrace);
  if (typeof action === 'string') {
    return { action: { type: action } as A, timestamp, stack };
  }
  if (!(action as A).type)
    return { action: { type: 'update' } as A, timestamp, stack };
  if ((action as StructuralPerformAction<A>).action)
    return (
      stack ? { stack, ...action } : action
    ) as StructuralPerformAction<A>;
  return { action, timestamp, stack } as StructuralPerformAction<A>;
}

interface LiftedMessage {
  readonly type: 'LIFTED';
  readonly liftedState: { readonly isPaused: boolean | undefined };
  readonly instanceId: number;
  readonly source: typeof source;
}

interface PartialStateMessage<S, A extends Action<string>> {
  readonly type: 'PARTIAL_STATE';
  readonly payload: PartialLiftedState<S, A>;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly maxAge: number;
}

interface ExportMessage<S, A extends Action<string>> {
  readonly type: 'EXPORT';
  readonly payload: readonly A[];
  readonly committedState: S;
  readonly source: typeof source;
  readonly instanceId: number;
}

export interface StructuralPerformAction<A extends Action<string>> {
  readonly action: A;
  readonly timestamp?: number;
  readonly stack?: string;
}

type SingleUserAction<A extends Action<string>> =
  | PerformAction<A>
  | StructuralPerformAction<A>
  | A;
type UserAction<A extends Action<string>> =
  | SingleUserAction<A>
  | readonly SingleUserAction<A>[];

interface ActionMessage<S, A extends Action<string>> {
  readonly type: 'ACTION';
  readonly payload: S;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly action: UserAction<A>;
  readonly maxAge: number;
  readonly nextActionId?: number;
  readonly name?: string;
}

interface StateMessage<S, A extends Action<string>> {
  readonly type: 'STATE';
  readonly payload: LiftedState<S, A, unknown>;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly libConfig?: LibConfig;
  readonly action?: UserAction<A>;
  readonly maxAge?: number;
  readonly name?: string;
}

export interface ErrorMessage {
  readonly type: 'ERROR';
  readonly payload: string;
  readonly source: typeof source;
  readonly instanceId: number;
  readonly message?: string | undefined;
}

interface InitInstanceMessage {
  readonly type: 'INIT_INSTANCE';
  readonly payload: undefined;
  readonly source: typeof source;
  readonly instanceId: number;
}

interface GetReportMessage {
  readonly type: 'GET_REPORT';
  readonly payload: string;
  readonly source: typeof source;
  readonly instanceId: number;
}

interface StopMessage {
  readonly type: 'STOP';
  readonly payload: undefined;
  readonly source: typeof source;
  readonly instanceId: number;
}

type ToContentScriptMessage<S, A extends Action<string>> =
  | LiftedMessage
  | PartialStateMessage<S, A>
  | ExportMessage<S, A>
  | ActionMessage<S, A>
  | StateMessage<S, A>
  | ErrorMessage
  | InitInstanceMessage
  | GetReportMessage
  | StopMessage;

export function toContentScript<S, A extends Action<string>>(
  message: ToContentScriptMessage<S, A>,
  serializeState?: Serialize | undefined,
  serializeAction?: Serialize | undefined,
) {
  if (message.type === 'ACTION') {
    post({
      ...message,
      action: stringify(message.action, serializeAction),
      payload: stringify(message.payload, serializeState),
    });
  } else if (message.type === 'STATE') {
    const { actionsById, computedStates, committedState, ...rest } =
      message.payload;
    post({
      ...message,
      payload: rest,
      actionsById: stringify(actionsById, serializeAction),
      computedStates: stringify(computedStates, serializeState),
      committedState: typeof committedState !== 'undefined',
    });
  } else if (message.type === 'PARTIAL_STATE') {
    const { actionsById, computedStates, committedState, ...rest } =
      message.payload;
    post({
      ...message,
      payload: rest,
      actionsById: stringify(actionsById, serializeAction),
      computedStates: stringify(computedStates, serializeState),
      committedState: typeof committedState !== 'undefined',
    });
  } else if (message.type === 'EXPORT') {
    post({
      ...message,
      payload: stringify(message.payload, serializeAction),
      committedState:
        typeof message.committedState !== 'undefined'
          ? stringify(message.committedState, serializeState)
          : (message.committedState as undefined),
    });
  } else {
    post(message);
  }
}

export function sendMessage<S, A extends Action<string>>(
  action: StructuralPerformAction<A> | StructuralPerformAction<A>[],
  state: LiftedState<S, A, unknown>,
  config: Config,
  instanceId?: number,
  name?: string,
) {
  let amendedAction = action;
  if (typeof config !== 'object') {
    // Legacy: sending actions not from connected part
    config = {}; // eslint-disable-line no-param-reassign
    if (action) amendedAction = amendActionType(action, config, sendMessage);
  }
  if (action) {
    toContentScript(
      {
        type: 'ACTION',
        action: amendedAction,
        payload: state,
        maxAge: config.maxAge!,
        source,
        name: config.name || name,
        instanceId: config.instanceId || instanceId || 1,
      },
      config.serialize as Serialize | undefined,
      config.serialize as Serialize | undefined,
    );
  } else {
    toContentScript<S, A>(
      {
        type: 'STATE',
        action: amendedAction,
        payload: state,
        maxAge: config.maxAge,
        source,
        name: config.name || name,
        instanceId: config.instanceId || instanceId || 1,
      },
      config.serialize as Serialize | undefined,
      config.serialize as Serialize | undefined,
    );
  }
}

function handleMessages(event: MessageEvent<ContentScriptToPageScriptMessage>) {
  if (process.env.BABEL_ENV !== 'test' && (!event || event.source !== window)) {
    return;
  }
  const message = event.data;
  if (!message || message.source !== '@devtools-extension') return;
  Object.keys(listeners).forEach((id) => {
    if (message.id && id !== message.id) return;
    const listenersForId = listeners[id];
    if (typeof listenersForId === 'function') listenersForId(message);
    else {
      listenersForId.forEach((fn) => {
        fn(message);
      });
    }
  });
}

export function setListener(
  onMessage: (message: ContentScriptToPageScriptMessage) => void,
  instanceId: number,
) {
  listeners[instanceId] = onMessage;
  window.addEventListener('message', handleMessages, false);
}

const liftListener =
  <S, A extends Action<string>>(
    listener: (message: ListenerMessage<S, A>) => void,
    config: Config,
  ) =>
  (message: ContentScriptToPageScriptMessage) => {
    if (message.type === 'IMPORT') {
      listener({
        type: 'DISPATCH',
        payload: {
          type: 'IMPORT_STATE',
          ...importState<S, A>(message.state, config)!,
        },
      });
    } else {
      listener(message);
    }
  };

export function disconnect() {
  window.removeEventListener('message', handleMessages);
  post({ type: 'DISCONNECT', source });
}

export interface ConnectResponse {
  init: <S, A extends Action<string>>(
    state: S,
    liftedData?: LiftedState<S, A, unknown>,
  ) => void;
  subscribe: <S, A extends Action<string>>(
    listener: (message: ListenerMessage<S, A>) => void,
  ) => (() => void) | undefined;
  unsubscribe: () => void;
  send: <S, A extends Action<string>>(
    action: A,
    state: LiftedState<S, A, unknown>,
  ) => void;
  error: (payload: string) => void;
}

export function connect(preConfig: Config): ConnectResponse {
  const config = preConfig || {};
  const id = generateId(config.instanceId);
  if (!config.instanceId) config.instanceId = id;
  if (!config.name) {
    config.name =
      document.title && id === 1 ? document.title : `Instance ${id}`;
  }
  if (config.serialize) config.serialize = getSerializeParameter(config);
  const actionCreators = config.actionCreators || {};
  const latency = config.latency;
  const predicate = config.predicate;
  const localFilter = getLocalFilter(config);
  const autoPause = config.autoPause;
  let isPaused = autoPause;
  let delayedActions: StructuralPerformAction<Action<string>>[] = [];
  let delayedStates: LiftedState<unknown, Action<string>, unknown>[] = [];

  const rootListener = (action: ContentScriptToPageScriptMessage) => {
    if (autoPause) {
      if (action.type === 'START') isPaused = false;
      else if (action.type === 'STOP') isPaused = true;
    }
    if (action.type === 'DISPATCH') {
      const payload = action.payload;
      if (payload.type === 'PAUSE_RECORDING') {
        isPaused = payload.status;
        toContentScript({
          type: 'LIFTED',
          liftedState: { isPaused },
          instanceId: id,
          source,
        });
      }
    }
  };

  listeners[id] = [rootListener];

  const subscribe = <S, A extends Action<string>>(
    listener: (message: ListenerMessage<S, A>) => void,
  ) => {
    if (!listener) return undefined;
    const liftedListener = liftListener(listener, config);
    const listenersForId = listeners[id] as ((
      message: ContentScriptToPageScriptMessage,
    ) => void)[];
    listenersForId.push(liftedListener);

    return function unsubscribe() {
      const index = listenersForId.indexOf(liftedListener);
      listenersForId.splice(index, 1);
    };
  };

  const unsubscribe = () => {
    delete listeners[id];
  };

  const sendDelayed = throttle(() => {
    sendMessage(
      delayedActions,
      delayedStates as unknown as LiftedState<unknown, Action<string>, unknown>,
      config,
    );
    delayedActions = [];
    delayedStates = [];
  }, latency);

  const send = <S, A extends Action<string>>(
    action: A,
    state: LiftedState<S, A, unknown>,
  ) => {
    if (
      isPaused ||
      isFiltered(action, localFilter) ||
      (predicate && !predicate(state, action))
    ) {
      return;
    }

    let amendedAction: A | StructuralPerformAction<A> = action;
    const amendedState = config.stateSanitizer
      ? config.stateSanitizer(state)
      : state;
    if (action) {
      if (config.getActionType) {
        amendedAction = config.getActionType(action);
        if (typeof amendedAction !== 'object') {
          amendedAction = {
            action: { type: amendedAction },
            timestamp: Date.now(),
          } as unknown as A;
        }
      } else if (config.actionSanitizer) {
        amendedAction = config.actionSanitizer(action);
      }
      amendedAction = amendActionType(amendedAction, config, send);
      if (latency) {
        delayedActions.push(amendedAction);
        delayedStates.push(amendedState);
        sendDelayed();
        return;
      }
    }
    sendMessage(
      amendedAction as StructuralPerformAction<A>,
      amendedState,
      config,
    );
  };

  const init = <S, A extends Action<string>>(
    state: S,
    liftedData?: LiftedState<S, A, unknown>,
  ) => {
    const message: InitMessage<S, A> = {
      type: 'INIT',
      payload: stringify(state, config.serialize as Serialize | undefined),
      instanceId: id,
      source,
    };
    if (liftedData && Array.isArray(liftedData)) {
      // Legacy
      message.action = stringify(liftedData);
      message.name = config.name;
    } else {
      if (liftedData) {
        message.liftedState = liftedData;
        if (liftedData.isPaused) isPaused = true;
      }
      message.libConfig = {
        actionCreators: JSON.stringify(getActionsArray(actionCreators)),
        name: config.name || document.title,
        features: config.features,
        serialize: !!config.serialize,
        type: config.type,
      };
    }
    post(message);
  };

  const error = (payload: string) => {
    post({ type: 'ERROR', payload, instanceId: id, source });
  };

  window.addEventListener('message', handleMessages, false);

  post({ type: 'INIT_INSTANCE', instanceId: id, source });

  return {
    init,
    subscribe,
    unsubscribe,
    send,
    error,
  };
}

export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
