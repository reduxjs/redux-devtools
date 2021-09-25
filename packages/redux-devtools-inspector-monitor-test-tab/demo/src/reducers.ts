import Immutable from 'immutable';
import shuffle from 'lodash.shuffle';
import { combineReducers, Reducer } from 'redux';
import {
  connectRouter,
  LocationChangeAction,
  RouterState,
} from 'connected-react-router';
import { History } from 'history';

type Nested = { long: { nested: { path: { to: { a: string } } }[] } };

const NESTED = {
  long: {
    nested: [
      {
        path: {
          to: {
            a: 'key',
          },
        },
      },
    ],
  },
};

const IMMUTABLE_NESTED = Immutable.fromJS(NESTED);

const IMMUTABLE_MAP = Immutable.Map({
  map: Immutable.Map({ a: 1, b: 2, c: 3 }),
  list: Immutable.List(['a', 'b', 'c']),
  set: Immutable.Set(['a', 'b', 'c']),
  stack: Immutable.Stack(['a', 'b', 'c']),
  seq: Immutable.Seq([1, 2, 3, 4, 5, 6, 7, 8]),
});

const HUGE_ARRAY = Array.from({ length: 5000 }).map((_, key) => ({
  str: `key ${key}`,
}));

const HUGE_OBJECT = Array.from({ length: 5000 }).reduce(
  (o: { [key: string]: string }, _, key) => (
    (o[`key ${key}`] = `item ${key}`), o
  ),
  {}
);

const FUNC = function (a: number, b: number, c: number) {
  return a + b + c;
};

const RECURSIVE: { obj?: unknown } = {};
RECURSIVE.obj = RECURSIVE;

function createIterator() {
  const iterable: { [Symbol.iterator](): IterableIterator<string> } = {
    [Symbol.iterator]: function* iterator() {
      for (let i = 0; i < 333; i++) {
        yield `item ${i}`;
      }
    },
  };

  return iterable;
}

const DEFAULT_SHUFFLE_ARRAY = [0, 1, null, { id: 1 }, { id: 2 }, 'string'];

export interface ToggleTimeoutUpdateAction {
  type: 'TOGGLE_TIMEOUT_UPDATE';
  timeoutUpdateEnabled: boolean;
}
export interface TimeoutUpdateAction {
  type: 'TIMEOUT_UPDATE';
}
export interface IncrementAction {
  type: 'INCREMENT';
}
export interface PushAction {
  type: 'PUSH';
}
export interface PopAction {
  type: 'POP';
}
export interface ReplaceAction {
  type: 'REPLACE';
}
export interface ChangeNestedAction {
  type: 'CHANGE_NESTED';
}
export interface PushHugeArrayAction {
  type: 'PUSH_HUGE_ARRAY';
}
export interface AddIteratorAction {
  type: 'ADD_ITERATOR';
}
export interface AddHugeObjectAction {
  type: 'ADD_HUGE_OBJECT';
}
export interface AddRecursiveAction {
  type: 'ADD_RECURSIVE';
}
export interface AddImmutableMapAction {
  type: 'ADD_IMMUTABLE_MAP';
}
export interface ChangeImmutableNestedAction {
  type: 'CHANGE_IMMUTABLE_NESTED';
}
export interface HugePayloadAction {
  type: 'HUGE_PAYLOAD';
  payload: number[];
}
export interface AddFunctionAction {
  type: 'ADD_FUNCTION';
}
export interface AddSymbolAction {
  type: 'ADD_SYMBOL';
}
export interface ShuffleArrayAction {
  type: 'SHUFFLE_ARRAY';
}
type DemoAppAction =
  | ToggleTimeoutUpdateAction
  | TimeoutUpdateAction
  | IncrementAction
  | PushAction
  | PopAction
  | ReplaceAction
  | ChangeNestedAction
  | PushHugeArrayAction
  | AddIteratorAction
  | AddHugeObjectAction
  | AddRecursiveAction
  | AddImmutableMapAction
  | ChangeImmutableNestedAction
  | HugePayloadAction
  | AddFunctionAction
  | AddSymbolAction
  | ShuffleArrayAction
  | LocationChangeAction;

export interface DemoAppState {
  router: RouterState;
  timeoutUpdateEnabled: boolean;
  store: number;
  undefined: { val: undefined };
  null: null;
  func: () => void;
  array: number[];
  hugeArrays: { str: string }[];
  hugeObjects: { [key: string]: string }[];
  iterators: { [Symbol.iterator](): IterableIterator<string> }[];
  nested: Nested;
  recursive: { obj?: unknown }[];
  immutables: Immutable.Map<string, unknown>[];
  immutableNested: Immutable.Map<unknown, unknown>;
  addFunction: { f: (a: number, b: number, c: number) => number } | null;
  addSymbol: { s: symbol; error: Error } | null;
  shuffleArray: unknown[];
}

const createRootReducer = (
  history: History
): Reducer<DemoAppState, DemoAppAction> =>
  combineReducers<DemoAppState, DemoAppAction>({
    router: connectRouter(history) as Reducer<RouterState, DemoAppAction>,
    timeoutUpdateEnabled: (state = false, action) =>
      action.type === 'TOGGLE_TIMEOUT_UPDATE'
        ? action.timeoutUpdateEnabled
        : state,
    store: (state = 0, action) =>
      action.type === 'INCREMENT' ? state + 1 : state,
    undefined: (state = { val: undefined }) => state,
    null: (state = null) => state,
    func: (
      state = () => {
        // noop
      }
    ) => state,
    array: (state = [], action) =>
      action.type === 'PUSH'
        ? [...state, Math.random()]
        : action.type === 'POP'
        ? state.slice(0, state.length - 1)
        : action.type === 'REPLACE'
        ? [Math.random(), ...state.slice(1)]
        : state,
    hugeArrays: (state = [], action) =>
      action.type === 'PUSH_HUGE_ARRAY' ? [...state, ...HUGE_ARRAY] : state,
    hugeObjects: (state = [], action) =>
      action.type === 'ADD_HUGE_OBJECT' ? [...state, HUGE_OBJECT] : state,
    iterators: (state = [], action) =>
      action.type === 'ADD_ITERATOR' ? [...state, createIterator()] : state,
    nested: (state = NESTED, action) =>
      action.type === 'CHANGE_NESTED'
        ? {
            ...state,
            long: {
              nested: [
                {
                  path: {
                    to: {
                      a: state.long.nested[0].path.to.a + '!',
                    },
                  },
                },
              ],
            },
          }
        : state,
    recursive: (state = [], action) =>
      action.type === 'ADD_RECURSIVE' ? [...state, { ...RECURSIVE }] : state,
    immutables: (state = [], action) =>
      action.type === 'ADD_IMMUTABLE_MAP' ? [...state, IMMUTABLE_MAP] : state,
    immutableNested: (state = IMMUTABLE_NESTED, action) =>
      action.type === 'CHANGE_IMMUTABLE_NESTED'
        ? state.updateIn(
            ['long', 'nested', 0, 'path', 'to', 'a'],
            (str: string) => str + '!'
          )
        : state,
    addFunction: (state = null, action) =>
      action.type === 'ADD_FUNCTION' ? { f: FUNC } : state,
    addSymbol: (state = null, action) =>
      action.type === 'ADD_SYMBOL'
        ? { s: window.Symbol('symbol'), error: new Error('TEST') }
        : state,
    shuffleArray: (state = DEFAULT_SHUFFLE_ARRAY, action) =>
      action.type === 'SHUFFLE_ARRAY' ? shuffle(state) : state,
  });

export default createRootReducer;
