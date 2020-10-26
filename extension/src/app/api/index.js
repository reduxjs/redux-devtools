import jsan from 'jsan';
import throttle from 'lodash/throttle';
import seralizeImmutable from 'remotedev-serialize/immutable/serialize';
import { getActionsArray } from 'remotedev-utils';
import { getLocalFilter, isFiltered } from './filters';
import importState from './importState';
import generateId from './generateInstanceId';

const listeners = {};
export const source = '@devtools-page';

function windowReplacer(key, value) {
  if (value && value.window === value) {
    return '[WINDOW]';
  }
  return value;
}

function tryCatchStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') console.log('Failed to stringify', err);
    /* eslint-enable no-console */
    return jsan.stringify(obj, windowReplacer, null, { circular: '[CIRCULAR]', date: true });
  }
}

let stringifyWarned;
function stringify(obj, serialize) {
  const str = typeof serialize === 'undefined' ? tryCatchStringify(obj) :
    jsan.stringify(obj, serialize.replacer, null, serialize.options);

  if (!stringifyWarned && str && str.length > 16 * 1024 * 1024) { // 16 MB
    /* eslint-disable no-console */
    console.warn('Application state or actions payloads are too large making Redux DevTools serialization slow and consuming a lot of memory. See https://git.io/fpcP5 on how to configure it.');
    /* eslint-enable no-console */
    stringifyWarned = true;
  }

  return str;
}

export function getSeralizeParameter(config, param) {
  const serialize = config.serialize;
  if (serialize) {
    if (serialize === true) return { options: true };
    if (serialize.immutable) {
      const immutableSerializer = seralizeImmutable(
        serialize.immutable, serialize.refs, serialize.replacer, serialize.reviver
      );
      return {
        replacer: immutableSerializer.replacer,
        reviver: immutableSerializer.reviver,
        options: typeof serialize.options === 'object' ?
          { ...immutableSerializer.options, ...serialize.options } : immutableSerializer.options
      };
    }
    if (!serialize.replacer && !serialize.reviver) return { options: serialize.options };
    return { replacer: serialize.replacer, reviver: serialize.reviver, options: serialize.options || true };
  }

  const value = config[param];
  if (typeof value === 'undefined') return undefined;
  console.warn(`\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead: https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1`); // eslint-disable-line

  if (typeof serializeState === 'boolean') return { options: value };
  if (typeof serializeState === 'function') return { replacer: value };
  return value;
}

function post(message) {
  window.postMessage(message, '*');
}

function getStackTrace(config, toExcludeFromTrace) {
  if (!config.trace) return undefined;
  if (typeof config.trace === 'function') return config.trace();

  let stack;
  let extraFrames = 0;
  let prevStackTraceLimit;
  const traceLimit = config.traceLimit;
  const error = Error();
  if (Error.captureStackTrace) {
    if (Error.stackTraceLimit < traceLimit) {
      prevStackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = traceLimit;
    }
    Error.captureStackTrace(error, toExcludeFromTrace);
  } else {
    extraFrames = 3;
  }
  stack = error.stack;
  if (prevStackTraceLimit) Error.stackTraceLimit = prevStackTraceLimit;
  if (extraFrames || typeof Error.stackTraceLimit !== 'number' || Error.stackTraceLimit > traceLimit) {
    const frames = stack.split('\n');
    if (frames.length > traceLimit) {
      stack = frames.slice(0, traceLimit + extraFrames + (frames[0] === 'Error' ? 1 : 0)).join('\n');
    }
  }
  return stack;
}

function amendActionType(action, config, toExcludeFromTrace) {
  let timestamp = Date.now();
  let stack = getStackTrace(config, toExcludeFromTrace);
  if (typeof action === 'string') return { action: { type: action }, timestamp, stack };
  if (!action.type) return { action: { type: 'update' }, timestamp, stack };
  if (action.action) return stack ? { stack, ...action } : action;
  return { action, timestamp, stack };
}

export function toContentScript(message, serializeState, serializeAction) {
  if (message.type === 'ACTION') {
    message.action = stringify(message.action, serializeAction);
    message.payload = stringify(message.payload, serializeState);
  } else if (message.type === 'STATE' || message.type === 'PARTIAL_STATE') {
    const { actionsById, computedStates, committedState, ...rest } = message.payload;
    message.payload = rest;
    message.actionsById = stringify(actionsById, serializeAction);
    message.computedStates = stringify(computedStates, serializeState);
    message.committedState = typeof committedState !== 'undefined';
  } else if (message.type === 'EXPORT') {
    message.payload = stringify(message.payload, serializeAction);
    if (typeof message.committedState !== 'undefined') {
      message.committedState = stringify(message.committedState, serializeState);
    }
  }
  post(message);
}

export function sendMessage(action, state, config, instanceId, name) {
  let amendedAction = action;
  if (typeof config !== 'object') {
    // Legacy: sending actions not from connected part
    config = {}; // eslint-disable-line no-param-reassign
    if (action) amendedAction = amendActionType(action, config, sendMessage);
  }
  const message = {
    type: action ? 'ACTION' : 'STATE',
    action: amendedAction,
    payload: state,
    maxAge: config.maxAge,
    source,
    name: config.name || name,
    instanceId: config.instanceId || instanceId || 1
  };
  toContentScript(message, config.serialize, config.serialize);
}

function handleMessages(event) {
  if (process.env.BABEL_ENV !== 'test' && (!event || event.source !== window)) return;
  const message = event.data;
  if (!message || message.source !== '@devtools-extension') return;
  Object.keys(listeners).forEach(id => {
    if (message.id && id !== message.id) return;
    if (typeof listeners[id] === 'function') listeners[id](message);
    else listeners[id].forEach(fn => { fn(message); });
  });
}

export function setListener(onMessage, instanceId) {
  listeners[instanceId] = onMessage;
  window.addEventListener('message', handleMessages, false);
}

const liftListener = (listener, config) => message => {
  let data = {};
  if (message.type === 'IMPORT') {
    data.type = 'DISPATCH';
    data.payload = {
      type: 'IMPORT_STATE',
      ...importState(message.state, config)
    };
  } else {
    data = message;
  }
  listener(data);
};

export function disconnect() {
  window.removeEventListener('message', handleMessages);
  post({ type: 'DISCONNECT', source });
}

export function connect(preConfig) {
  const config = preConfig || {};
  const id = generateId(config.instanceId);
  if (!config.instanceId) config.instanceId = id;
  if (!config.name) config.name = document.title && id === 1 ? document.title : `Instance ${id}`;
  if (config.serialize) config.serialize = getSeralizeParameter(config);
  const actionCreators = config.actionCreators || {};
  const latency = config.latency;
  const predicate = config.predicate;
  const localFilter = getLocalFilter(config);
  const autoPause = config.autoPause;
  let isPaused = autoPause;
  let delayedActions = [];
  let delayedStates = [];

  const rootListiner = action => {
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
          source
        });
      }
    }
  };

  listeners[id] = [rootListiner];

  const subscribe = (listener) => {
    if (!listener) return undefined;
    const liftedListener = liftListener(listener, config);
    listeners[id].push(liftedListener);

    return function unsubscribe() {
      const index = listeners[id].indexOf(liftedListener);
      listeners[id].splice(index, 1);
    };
  };

  const unsubscribe = () => {
    delete listeners[id];
  };

  const sendDelayed = throttle(() => {
    sendMessage(delayedActions, delayedStates, config);
    delayedActions = [];
    delayedStates = [];
  }, latency);

  const send = (action, state) => {
    if (isPaused || isFiltered(action, localFilter) || predicate && !predicate(state, action)) {
      return;
    }

    let amendedAction = action;
    const amendedState = config.stateSanitizer ? config.stateSanitizer(state) : state;
    if (action) {
      if (config.getActionType) {
        amendedAction = config.getActionType(action);
        if (typeof amendedAction !== 'object') {
          amendedAction = { action: { type: amendedAction }, timestamp: Date.now() };
        }
      }
      else if (config.actionSanitizer) amendedAction = config.actionSanitizer(action);
      amendedAction = amendActionType(amendedAction, config, send);
      if (latency) {
        delayedActions.push(amendedAction);
        delayedStates.push(amendedState);
        sendDelayed();
        return;
      }
    }
    sendMessage(amendedAction, amendedState, config);
  };

  const init = (state, liftedData) => {
    const message = {
      type: 'INIT',
      payload: stringify(state, config.serialize),
      instanceId: id,
      source
    };
    if (liftedData && Array.isArray(liftedData)) { // Legacy
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
        type: config.type
      };
    }
    post(message);
  };

  const error = (payload) => {
    post({ type: 'ERROR', payload, id, source });
  };

  window.addEventListener('message', handleMessages, false);

  post({ type: 'INIT_INSTANCE', instanceId: id, source });

  return {
    init,
    subscribe,
    unsubscribe,
    send,
    error
  };
}

export function updateStore(stores) {
  return function(newStore, instanceId) {
    /* eslint-disable no-console */
    console.warn('`__REDUX_DEVTOOLS_EXTENSION__.updateStore` is deprecated, remove it and just use ' +
      '`__REDUX_DEVTOOLS_EXTENSION_COMPOSE__` instead of the extension\'s store enhancer: ' +
      'https://github.com/zalmoxisus/redux-devtools-extension#12-advanced-store-setup');
    /* eslint-enable no-console */
    const store = stores[instanceId || Object.keys(stores)[0]];
    // Mutate the store in order to keep the reference
    store.liftedStore = newStore.liftedStore;
    store.getState = newStore.getState;
    store.dispatch = newStore.dispatch;
  };
}

export function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
