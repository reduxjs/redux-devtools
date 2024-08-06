import Immutable from 'immutable';
import shuffle from 'lodash.shuffle';
import { combineReducers, Reducer } from 'redux';

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

const IMMUTABLE_NESTED = Immutable.fromJS(NESTED) as Immutable.Map<
  unknown,
  unknown
>;

const IMMUTABLE_MAP = Immutable.Map({
  map: Immutable.Map({ a: 1, b: 2, c: 3 }),
  list: Immutable.List(['a', 'b', 'c']),
  set: Immutable.Set(['a', 'b', 'c']),
  stack: Immutable.Stack(['a', 'b', 'c']),
  seq: Immutable.Seq([1, 2, 3, 4, 5, 6, 7, 8]),
});

type MapValue =
  | Map<{ first: boolean } | string, number>
  | WeakMap<{ first: boolean } | { second: number }, number>
  | Set<{ first: boolean } | string>
  | WeakSet<{ first: boolean } | { second: number }>;

const NATIVE_MAP = new window.Map<string, MapValue>([
  [
    'map',
    new window.Map<{ first: boolean } | string, number>([
      [{ first: true }, 1],
      ['second', 2],
    ]),
  ],
  [
    'weakMap',
    new window.WeakMap<{ first: boolean } | { second: number }, number>([
      [{ first: true }, 1],
      [{ second: 1 }, 2],
    ]),
  ],
  ['set', new window.Set([{ first: true }, 'second'])],
  ['weakSet', new window.WeakSet([{ first: true }, { second: 1 }])],
]);

const HUGE_ARRAY = Array.from({ length: 5000 }).map((_, key) => ({
  str: `key ${key}`,
}));

const HUGE_OBJECT = Array.from({ length: 5000 }).reduce(
  (o: { [key: string]: string }, _, key) => (
    (o[`key ${key}`] = `item ${key}`), o
  ),
  {},
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
export interface AddNativeMapAction {
  type: 'ADD_NATIVE_MAP';
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
  | AddNativeMapAction
  | AddImmutableMapAction
  | ChangeImmutableNestedAction
  | HugePayloadAction
  | AddFunctionAction
  | AddSymbolAction
  | ShuffleArrayAction;

export interface DemoAppState {
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
  maps: Map<string, MapValue>[];
  immutableNested: Immutable.Map<unknown, unknown>;
  addFunction: { f: (a: number, b: number, c: number) => number } | null;
  addSymbol: { s: symbol; error: Error } | null;
  shuffleArray: unknown[];
}

export const rootReducer: Reducer<DemoAppState, DemoAppAction> =
  combineReducers({
    timeoutUpdateEnabled: (state = false, action: DemoAppAction) =>
      action.type === 'TOGGLE_TIMEOUT_UPDATE'
        ? action.timeoutUpdateEnabled
        : state,
    store: (state = 0, action: DemoAppAction) =>
      action.type === 'INCREMENT' ? state + 1 : state,
    undefined: (state = { val: undefined }) => state,
    null: (state = null) => state,
    func: (
      state = () => {
        // noop
      },
    ) => state,
    array: (state = [], action: DemoAppAction) =>
      action.type === 'PUSH'
        ? [...state, Math.random()]
        : action.type === 'POP'
          ? state.slice(0, state.length - 1)
          : action.type === 'REPLACE'
            ? [Math.random(), ...state.slice(1)]
            : state,
    hugeArrays: (state = [], action: DemoAppAction) =>
      action.type === 'PUSH_HUGE_ARRAY' ? [...state, ...HUGE_ARRAY] : state,
    hugeObjects: (state = [], action: DemoAppAction) =>
      action.type === 'ADD_HUGE_OBJECT' ? [...state, HUGE_OBJECT] : state,
    iterators: (state = [], action: DemoAppAction) =>
      action.type === 'ADD_ITERATOR' ? [...state, createIterator()] : state,
    nested: (state = NESTED, action: DemoAppAction) =>
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
    recursive: (state: { obj?: unknown }[] = [], action: DemoAppAction) =>
      action.type === 'ADD_RECURSIVE' ? [...state, { ...RECURSIVE }] : state,
    immutables: (
      state: Immutable.Map<string, unknown>[] = [],
      action: DemoAppAction,
    ) =>
      action.type === 'ADD_IMMUTABLE_MAP' ? [...state, IMMUTABLE_MAP] : state,
    maps: (state: Map<string, MapValue>[] = [], action: DemoAppAction) =>
      action.type === 'ADD_NATIVE_MAP' ? [...state, NATIVE_MAP] : state,
    immutableNested: (state = IMMUTABLE_NESTED, action: DemoAppAction) =>
      action.type === 'CHANGE_IMMUTABLE_NESTED'
        ? state.updateIn(
            ['long', 'nested', 0, 'path', 'to', 'a'],
            (str: unknown) => (str as string) + '!',
          )
        : state,
    addFunction: (state = null, action: DemoAppAction) =>
      action.type === 'ADD_FUNCTION' ? { f: FUNC } : state,
    addSymbol: (state = null, action: DemoAppAction) =>
      action.type === 'ADD_SYMBOL'
        ? { s: window.Symbol('symbol'), error: new Error('TEST') }
        : state,
    shuffleArray: (state = DEFAULT_SHUFFLE_ARRAY, action: DemoAppAction) =>
      action.type === 'SHUFFLE_ARRAY' ? shuffle(state) : state,
  }) as any;
