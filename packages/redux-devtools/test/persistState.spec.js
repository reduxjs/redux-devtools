import expect from 'expect';
import { instrument, persistState } from '../src';
import { compose, createStore } from 'redux';

describe('persistState', () => {
  let savedLocalStorage = global.localStorage;

  beforeEach(() => {
    global.localStorage = {
      store: {},
      getItem(key) {
        return this.store[key] || null;
      },
      setItem(key, value) {
        this.store[key] = value;
      },
      removeItem(key) {
        delete this.store[key];
      },
      clear() {
        this.store = {};
      }
    };
  });

  after(() => {
    global.localStorage = savedLocalStorage;
  });

  const reducer = (state = 0, action) => {
    switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
    }
  };

  it('should persist state', () => {
    const store = createStore(reducer, compose(instrument(), persistState('id')));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(reducer, compose(instrument(), persistState('id')));
    expect(store2.getState()).toBe(2);
  });

  it('should not persist state if no session id', () => {
    const store = createStore(reducer, compose(instrument(), persistState()));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(reducer, compose(instrument(), persistState()));
    expect(store2.getState()).toBe(0);
  });

  it('should run with a custom state deserializer', () => {
    const oneLess = state => state === undefined ? -1 : state - 1;
    const store = createStore(reducer, compose(instrument(), persistState('id', oneLess)));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(reducer, compose(instrument(), persistState('id', oneLess)));
    expect(store2.getState()).toBe(1);
  });

  it('should run with a custom action deserializer', () => {
    const incToDec = action => action.type === 'INCREMENT' ? { type: 'DECREMENT' } : action;
    const store = createStore(reducer, compose(instrument(), persistState('id', undefined, incToDec)));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(reducer, compose(instrument(), persistState('id', undefined, incToDec)));
    expect(store2.getState()).toBe(-2);
  });

  it('should warn if read from localStorage fails', () => {
    const spy = expect.spyOn(console, 'warn');
    delete global.localStorage.getItem;
    createStore(reducer, compose(instrument(), persistState('id')));

    expect(spy.calls).toContain(
      /Could not read debug session from localStorage/,
      (call, errMsg) => call.arguments[0].match(errMsg)
    );

    spy.restore();
  });

  it('should warn if write to localStorage fails', () => {
    const spy = expect.spyOn(console, 'warn');
    delete global.localStorage.setItem;
    const store = createStore(reducer, compose(instrument(), persistState('id')));

    store.dispatch({ type: 'INCREMENT' });
    expect(spy.calls).toContain(
      /Could not write debug session to localStorage/,
      (call, errMsg) => call.arguments[0].match(errMsg)
    );

    spy.restore();
  });
});
