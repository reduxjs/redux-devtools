import Immutable from 'immutable';
import shuffle from 'lodash.shuffle';

const NESTED = {
  long: {
    nested: [{
      path: {
        to: {
          a: 'key'
        }
      }
    }]
  }
};

const IMMUTABLE_NESTED = Immutable.fromJS(NESTED);

/* eslint-disable babel/new-cap */

const IMMUTABLE_MAP = Immutable.Map({
  map: Immutable.Map({ a:1, b: 2, c: 3 }),
  list: Immutable.List(['a', 'b', 'c']),
  set: Immutable.Set(['a', 'b', 'c']),
  stack: Immutable.Stack(['a', 'b', 'c']),
  seq: Immutable.Seq.of(1, 2, 3, 4, 5, 6, 7, 8)
});

/* eslint-enable babel/new-cap */

const HUGE_ARRAY = Array.from({ length: 5000 })
  .map((_, key) => ({ str: 'key ' + key }));

const HUGE_OBJECT = Array.from({ length: 5000 })
  .reduce((o, _, key) => (o['key ' + key] = 'item ' + key, o), {});

const FUNC = function (a, b, c) { return a + b + c; };

const RECURSIVE = {};
RECURSIVE.obj = RECURSIVE;

function createIterator() {
  const iterable = {};
  iterable[window.Symbol.iterator] = function *iterator() {
    for (var i = 0; i < 333; i++) {
      yield 'item ' + i;
    }
  }

  return iterable;
}

const DEFAULT_SHUFFLE_ARRAY = [0, 1, null, { id: 1 }, { id: 2 }, 'string'];

export default {
  timeoutUpdateEnabled: (state=false, action) => action.type === 'TOGGLE_TIMEOUT_UPDATE' ?
    action.timeoutUpdateEnabled : state,
  store: (state=0, action) => action.type === 'INCREMENT' ? state + 1 : state,
  undefined: (state={ val: undefined }) => state,
  null: (state=null) => state,
  func: (state=() => {}) => state,
  array: (state=[], action) => action.type === 'PUSH' ?
    [...state, Math.random()] : (
      action.type === 'POP' ? state.slice(0, state.length - 1) : (
        action.type === 'REPLACE' ? [Math.random(), ...state.slice(1)] : state
      )
    ),
  hugeArrays: (state=[], action) => action.type === 'PUSH_HUGE_ARRAY' ?
    [ ...state, ...HUGE_ARRAY ] : state,
  hugeObjects: (state=[], action) => action.type === 'ADD_HUGE_OBJECT' ?
    [ ...state, HUGE_OBJECT ] : state,
  iterators: (state=[], action) => action.type === 'ADD_ITERATOR' ?
    [...state, createIterator()] : state,
  nested: (state=NESTED, action) =>
    action.type === 'CHANGE_NESTED' ?
      {
        ...state,
        long: {
          nested: [{
            path: {
              to: {
                a: state.long.nested[0].path.to.a + '!'
              }
            }
          }]
        }
      } : state,
  recursive: (state=[], action) => action.type === 'ADD_RECURSIVE' ?
    [...state, { ...RECURSIVE }] : state,
  immutables: (state=[], action) => action.type === 'ADD_IMMUTABLE_MAP' ?
    [...state, IMMUTABLE_MAP] : state,
  immutableNested: (state=IMMUTABLE_NESTED, action) => action.type === 'CHANGE_IMMUTABLE_NESTED' ?
    state.updateIn(
      ['long', 'nested', 0, 'path', 'to', 'a'],
      str => str + '!'
    ) : state,
  addFunction: (state=null, action) => action.type === 'ADD_FUNCTION' ?
    { f: FUNC } : state,
  addSymbol: (state=null, action) => action.type === 'ADD_SYMBOL' ?
    { s: window.Symbol('symbol') } : state,
  shuffleArray: (state=DEFAULT_SHUFFLE_ARRAY, action) =>
    action.type === 'SHUFFLE_ARRAY' ?
      shuffle(state) : state
};
