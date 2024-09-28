import { instrument, persistState } from '../src';
import { compose, createStore, StoreEnhancer } from 'redux';

describe('persistState', () => {
  const savedLocalStorage = global.localStorage;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  delete global.localStorage;

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
      },
      get length() {
        return this.store.length;
      },
      key(index) {
        throw new Error('Unimplemented');
      },
    };
  });

  afterAll(() => {
    global.localStorage = savedLocalStorage;
  });

  type Action = { type: 'INCREMENT' } | { type: 'DECREMENT' };
  const reducer = (state = 0, action: Action) => {
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
    const store = createStore(
      reducer,
      compose(instrument(), persistState('id')) as StoreEnhancer,
    );
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(
      reducer,
      compose(instrument(), persistState('id')) as StoreEnhancer,
    );
    expect(store2.getState()).toBe(2);
  });

  it('should not persist state if no session id', () => {
    const store = createStore(
      reducer,
      compose(instrument(), persistState()) as StoreEnhancer,
    );
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(
      reducer,
      compose(instrument(), persistState()) as StoreEnhancer,
    );
    expect(store2.getState()).toBe(0);
  });

  it('should run with a custom state deserializer', () => {
    const oneLess = (state: number | undefined) =>
      state === undefined ? -1 : state - 1;
    const store = createStore(
      reducer,
      compose(instrument(), persistState('id', oneLess)) as StoreEnhancer,
    );
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(
      reducer,
      compose(instrument(), persistState('id', oneLess)) as StoreEnhancer,
    );
    expect(store2.getState()).toBe(1);
  });

  it('should run with a custom action deserializer', () => {
    const incToDec = (action: Action) =>
      action.type === 'INCREMENT' ? ({ type: 'DECREMENT' } as const) : action;
    const store = createStore(
      reducer,
      compose(
        instrument(),
        persistState('id', undefined, incToDec),
      ) as StoreEnhancer,
    );
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    const store2 = createStore(
      reducer,
      compose(
        instrument(),
        persistState('id', undefined, incToDec),
      ) as StoreEnhancer,
    );
    expect(store2.getState()).toBe(-2);
  });

  it('should warn if read from localStorage fails', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {
      // noop
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.localStorage.getItem;
    createStore(
      reducer,
      compose(instrument(), persistState('id')) as StoreEnhancer,
    );

    expect(spy.mock.calls[0]).toContain(
      'Could not read debug session from localStorage:',
    );

    spy.mockReset();
  });

  it('should warn if write to localStorage fails', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {
      // noop
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete global.localStorage.setItem;
    const store = createStore(
      reducer,
      compose(instrument(), persistState('id')) as StoreEnhancer,
    );

    store.dispatch({ type: 'INCREMENT' });
    expect(spy.mock.calls[0]).toContain(
      'Could not write debug session to localStorage:',
    );

    spy.mockReset();
  });
});
