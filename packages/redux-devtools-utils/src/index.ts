import getParams from 'get-params';
import jsan from 'jsan';
import { nanoid } from 'nanoid/non-secure';
import { immutableSerialize } from '@redux-devtools/serialize';
import Immutable from 'immutable';
import { Action, ActionCreator } from 'redux';

export function generateId(id: string | undefined) {
  return id || nanoid(7);
}

export interface ActionCreatorObject {
  readonly name: string;
  readonly func: ActionCreator<Action<string>>;
  readonly args: readonly string[];
}

function flatTree(
  obj: { [key: string]: ActionCreator<Action<string>> },
  namespace = '',
) {
  let functions: ActionCreatorObject[] = [];
  Object.keys(obj).forEach((key) => {
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

export function getMethods(obj: unknown) {
  if (typeof obj !== 'object') return undefined;
  let functions:
    | {
        name: string;
        args: string[];
      }[]
    | undefined;
  let m: { [key: string]: (...args: any[]) => unknown } | undefined;
  if ((obj as any).__proto__) m = (obj as any).__proto__.__proto__;
  if (!m) m = obj as any;

  Object.getOwnPropertyNames(m).forEach((key) => {
    const propDescriptor = Object.getOwnPropertyDescriptor(m, key);
    if (!propDescriptor || 'get' in propDescriptor || 'set' in propDescriptor)
      return;
    const prop = m![key];
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

export function getActionsArray(actionCreators: {
  [key: string]: ActionCreator<Action<string>>;
}) {
  if (Array.isArray(actionCreators)) return actionCreators;
  return flatTree(actionCreators);
}

const interpretArg = (arg: string): unknown =>
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  new Function('return ' + arg)();

function evalArgs(inArgs: string[], restArgs: string): unknown[] {
  const args = inArgs.map(interpretArg);
  if (!restArgs) return args;
  const rest = interpretArg(restArgs);
  if (Array.isArray(rest)) return args.concat(...(rest as unknown[]));
  throw new Error('rest must be an array');
}

export function evalAction(
  action: string | { args: string[]; rest: string; selected: number },
  actionCreators: readonly ActionCreatorObject[],
) {
  if (typeof action === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function('return ' + action)();
  }

  const actionCreator = actionCreators[action.selected].func;
  const args = evalArgs(action.args, action.rest);
  return actionCreator(...args);
}

export function evalMethod(
  action: string | { args: string[]; rest: string; name: string },
  obj: unknown,
) {
  if (typeof action === 'string') {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    return new Function('return ' + action).call(obj);
  }

  const args = evalArgs(action.args, action.rest);
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  return new Function('args', `return this.${action.name}(args)`).apply(
    obj,
    args,
  );
}
/* eslint-enable */

function tryCatchStringify(obj: unknown) {
  try {
    return JSON.stringify(obj);
  } catch (err) {
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production')
      console.log('Failed to stringify', err);
    /* eslint-enable no-console */
    return jsan.stringify(
      obj,
      null as unknown as undefined,
      null as unknown as undefined,
      {
        circular: '[CIRCULAR]',
      } as unknown as boolean,
    );
  }
}

export function stringify(
  obj: unknown,
  serialize?:
    | {
        replacer?: (key: string, value: unknown) => unknown;
        options?: unknown | boolean;
      }
    | true,
) {
  if (typeof serialize === 'undefined') {
    return tryCatchStringify(obj);
  }
  if (serialize === true) {
    return jsan.stringify(
      obj,
      function (key, value) {
        if (value && typeof (value as any).toJS === 'function')
          return (value as any).toJS();
        return value;
      },
      null as unknown as undefined,
      true,
    );
  }
  return jsan.stringify(
    obj,
    serialize.replacer,
    null as unknown as undefined,
    serialize.options as boolean,
  );
}

export function getSeralizeParameter(
  config: {
    serialize?:
      | {
          immutable?: typeof Immutable;
          refs?: (new (data: any) => unknown)[] | null;
          replacer?: (key: string, value: unknown) => unknown;
          options?: unknown | boolean;
        }
      | boolean;
  },
  param: string,
):
  | {
      replacer?: (key: string, value: unknown) => unknown;
      options: unknown | boolean;
    }
  | undefined {
  const serialize = config.serialize;
  if (serialize) {
    if (serialize === true) return { options: true };
    if (serialize.immutable) {
      return {
        replacer: immutableSerialize(serialize.immutable, serialize.refs)
          .replacer,
        options: serialize.options || true,
      };
    }
    if (!serialize.replacer) return { options: serialize.options };
    return { replacer: serialize.replacer, options: serialize.options || true };
  }

  const value = (
    config as {
      [param: string]: {
        replacer?: (key: string, value: unknown) => unknown;
        options: unknown | boolean;
      };
    }
  )[param];
  if (typeof value === 'undefined') return undefined;
  // eslint-disable-next-line no-console
  console.warn(
    `\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead:` +
      ' https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1',
  );

  return value;
}

export function getStackTrace(
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  config: { trace?: () => {}; traceLimit: number },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  toExcludeFromTrace?: Function | undefined,
) {
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
  if (
    extraFrames ||
    typeof Error.stackTraceLimit !== 'number' ||
    Error.stackTraceLimit > traceLimit
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const frames = stack!.split('\n');
    if (frames.length > traceLimit) {
      stack = frames
        .slice(0, traceLimit + extraFrames + (frames[0] === 'Error' ? 1 : 0))
        .join('\n');
    }
  }
  return stack;
}

export * from './catchErrors';
export * from './filters';
export * from './importState';
