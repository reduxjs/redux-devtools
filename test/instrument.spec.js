import expect, { spyOn } from 'expect';
import { createStore } from 'redux';
import instrument, { ActionCreators } from '../src/instrument';

function counter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT': return state + 1;
  case 'DECREMENT': return state - 1;
  default: return state;
  }
}

function counterWithBug(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return mistake - 1; // eslint-disable-line no-undef
    case 'SET_UNDEFINED': return undefined;
    default: return state;
  }
}

function doubleCounter(state = 0, action) {
  switch (action.type) {
  case 'INCREMENT': return state + 2;
  case 'DECREMENT': return state - 2;
  default: return state;
  }
}

describe('instrument', () => {
  let store;
  let liftedStore;

  beforeEach(() => {
    store = instrument()(createStore)(counter);
    liftedStore = store.liftedStore;
  });

  it('should perform actions', () => {
    expect(store.getState()).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);
  });

  it('should rollback state to the last committed state', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.commit());
    expect(store.getState()).toBe(2);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(4);

    liftedStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(2);

    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(2);
  });

  it('should reset to initial state', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.commit());
    expect(store.getState()).toBe(1);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(1);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.reset());
    expect(store.getState()).toBe(0);
  });

  it('should toggle an action', () => {
    // stateIndex 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(1);
  });

  it('should sweep disabled actions', () => {
    // stateIndex 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(3);

    liftedStore.dispatch(ActionCreators.sweep());
    expect(store.getState()).toBe(3);

    liftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.sweep());
    expect(store.getState()).toBe(2);
  });

  it('should jump to state', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.jumpToState(0));
    expect(store.getState()).toBe(0);

    liftedStore.dispatch(ActionCreators.jumpToState(1));
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.jumpToState(2));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(0);

    liftedStore.dispatch(ActionCreators.jumpToState(4));
    expect(store.getState()).toBe(2);
  });

  it('should replace the reducer', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    store.replaceReducer(doubleCounter);
    expect(store.getState()).toBe(2);
  });

  it('should catch and record errors', () => {
    let spy = spyOn(console, 'error');
    let storeWithBug = instrument()(createStore)(counterWithBug);

    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'DECREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });

    let { computedStates } = storeWithBug.liftedStore.getState();
    expect(computedStates[2].error).toMatch(
      /ReferenceError/
    );
    expect(computedStates[3].error).toMatch(
      /Interrupted by an error up the chain/
    );
    expect(spy.calls[0].arguments[0]).toMatch(
      /ReferenceError/
    );

    spy.restore();
  });

  it('should return the last non-undefined state from getState', () => {
    let storeWithBug = instrument()(createStore)(counterWithBug);
    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });
    expect(storeWithBug.getState()).toBe(2);

    storeWithBug.dispatch({ type: 'SET_UNDEFINED' });
    expect(storeWithBug.getState()).toBe(2);
  });

  it('should not recompute states on every action', () => {
    let reducerCalls = 0;
    let monitoredStore = instrument()(createStore)(() => reducerCalls++);
    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);
  });

  it('should not recompute states when jumping to state', () => {
    let reducerCalls = 0;
    let monitoredStore = instrument()(createStore)(() => reducerCalls++);
    let monitoredInstrumentedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    monitoredInstrumentedStore.dispatch(ActionCreators.jumpToState(0));
    expect(reducerCalls).toBe(4);

    monitoredInstrumentedStore.dispatch(ActionCreators.jumpToState(1));
    expect(reducerCalls).toBe(4);

    monitoredInstrumentedStore.dispatch(ActionCreators.jumpToState(3));
    expect(reducerCalls).toBe(4);
  });
});
