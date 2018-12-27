import getParams from 'get-params';
import jsan from 'jsan';
import nanoid from 'nanoid/non-secure';
import seralizeImmutable from 'remotedev-serialize/immutable/serialize';

export function generateId(id) {
  return id || nanoid(7);
}

function flatTree(obj, namespace = '') {
  let functions = [];
  Object.keys(obj).forEach(key => {
    const prop = obj[key];
    if (typeof prop === 'function') {
      functions.push({
        name: namespace + (key || prop.name || 'anonymous'),
        func: prop,
        args: getParams(prop),
      });
    } else if (typeof prop === 'object') {
      functions = functions.concat(flatTree(prop, namespace + key + '.'));
    }
  });
  return functions;
}

export function getMethods(obj) {
  if (typeof obj !== 'object') return undefined;
  let functions;
  let m;
  if (obj.__proto__) m = obj.__proto__.__proto__;
  if (!m) m = obj;

  Object.getOwnPropertyNames(m).forEach(key => {
    const propDescriptor = Object.getOwnPropertyDescriptor(m, key);
    if (!propDescriptor || 'get' in propDescriptor || 'set' in propDescriptor) return;
    const prop = m[key];
    if (typeof prop === 'function' && key !== 'constructor') {
      if (!functions) functions = [];
      functions.push({
        name: key || prop.name || 'anonymous',
        args: getParams(prop),
      });
    }
  });
  return functions;
}

export function getActionsArray(actionCreators) {
  if (Array.isArray(actionCreators)) return actionCreators;
  return flatTree(actionCreators);
}

/* eslint-disable no-new-func */
const interpretArg = (arg) => (new Function('return ' + arg))();

function evalArgs(inArgs, restArgs) {
  const args = inArgs.map(interpretArg);
  if (!restArgs) return args;
  const rest = interpretArg(restArgs);
  if (Array.isArray(rest)) return args.concat(...rest);
  throw new Error('rest must be an array');
}

export function evalAction(action, actionCreators) {
  if (typeof action === 'string') {
    return (new Function('return ' + action))();
  }

  const actionCreator = actionCreators[action.selected].func;
  const args = evalArgs(action.args, action.rest);
  return actionCreator(...args);
}

export function evalMethod(action, obj) {
  if (typeof action === 'string') {
    return (new Function('return ' + action)).call(obj);
  }

  const args = evalArgs(action.args, action.rest);
  return (new Function('args', `return this.${action.name}(args)`)).apply(obj, args);
}
/* eslint-enable */

function tryCatchStringify(obj) {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') console.log('Failed to stringify', err);
    /* eslint-enable no-console */
    return jsan.stringify(obj, null, null, { circular: '[CIRCULAR]' });
  }
}

export function stringify(obj, serialize) {
  if (typeof serialize === 'undefined') {
    return tryCatchStringify(obj);
  }
  if (serialize === true) {
    return jsan.stringify(obj, function (key, value) {
      if (value && typeof value.toJS === 'function') return value.toJS();
      return value;
    }, null, true);
  }
  return jsan.stringify(obj, serialize.replacer, null, serialize.options);
}

export function getSeralizeParameter(config, param) {
  const serialize = config.serialize;
  if (serialize) {
    if (serialize === true) return { options: true };
    if (serialize.immutable) {
      return {
        replacer: seralizeImmutable(serialize.immutable, serialize.refs).replacer,
        options: serialize.options || true
      };
    }
    if (!serialize.replacer) return { options: serialize.options };
    return { replacer: serialize.replacer, options: serialize.options || true };
  }

  const value = config[param];
  if (typeof value === 'undefined') return undefined;
  console.warn(`\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead: https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1`); // eslint-disable-line

  if (typeof serializeState === 'boolean') return { options: value };
  if (typeof serializeState === 'function') return { replacer: value };
  return value;
}

export function getStackTrace(config, toExcludeFromTrace) {
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
