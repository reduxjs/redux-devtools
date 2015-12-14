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
    // actionId 0 = @@INIT
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
    // actionId 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });

    expect(store.getState()).toBe(2);
    expect(liftedStore.getState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
    expect(liftedStore.getState().skippedActionIds).toEqual([]);

    liftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(3);
    expect(liftedStore.getState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
    expect(liftedStore.getState().skippedActionIds).toEqual([2]);

    liftedStore.dispatch(ActionCreators.sweep());
    expect(store.getState()).toBe(3);
    expect(liftedStore.getState().stagedActionIds).toEqual([0, 1, 3, 4]);
    expect(liftedStore.getState().skippedActionIds).toEqual([]);
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

  it('should not recompute old states when toggling an action', () => {
    let reducerCalls = 0;
    let monitoredStore = instrument()(createStore)(() => reducerCalls++);
    let monitoredLiftedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    // actionId 0 = @@INIT
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(3));
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(3));
    expect(reducerCalls).toBe(5);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(reducerCalls).toBe(6);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(reducerCalls).toBe(8);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(1));
    expect(reducerCalls).toBe(10);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(reducerCalls).toBe(11);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(3));
    expect(reducerCalls).toBe(11);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(1));
    expect(reducerCalls).toBe(12);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(3));
    expect(reducerCalls).toBe(13);

    monitoredLiftedStore.dispatch(ActionCreators.toggleAction(2));
    expect(reducerCalls).toBe(15);
  });

  it('should not recompute states when jumping to state', () => {
    let reducerCalls = 0;
    let monitoredStore = instrument()(createStore)(() => reducerCalls++);
    let monitoredLiftedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    let savedComputedStates = monitoredLiftedStore.getState().computedStates;

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(0));
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(1));
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(3));
    expect(reducerCalls).toBe(4);

    expect(monitoredLiftedStore.getState().computedStates).toBe(savedComputedStates);
  });


  it('should not recompute states on monitor actions', () => {
    let reducerCalls = 0;
    let monitoredStore = instrument()(createStore)(() => reducerCalls++);
    let monitoredLiftedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    let savedComputedStates = monitoredLiftedStore.getState().computedStates;

    monitoredLiftedStore.dispatch({ type: 'lol' });
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch({ type: 'wat' });
    expect(reducerCalls).toBe(4);

    expect(monitoredLiftedStore.getState().computedStates).toBe(savedComputedStates);
  });

  describe('Import State', () => {
    let monitoredStore;
    let monitoredLiftedStore;
    let exportedState;

    beforeEach(() => {
      monitoredStore = instrument()(createStore)(counter);
      monitoredLiftedStore = monitoredStore.liftedStore;
      // Set up state to export
      monitoredStore.dispatch({ type: 'INCREMENT' });
      monitoredStore.dispatch({ type: 'INCREMENT' });
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
    });

    it('should replay all the steps when a state is imported', () => {
      let importMonitoredStore = instrument()(createStore)(counter);
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(exportedState));
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      let importMonitoredStore = instrument()(createStore)(counter);
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(exportedState));
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });
  });
});
