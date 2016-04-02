import expect, { spyOn } from 'expect';
import { createStore, compose } from 'redux';
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

function counterWithAnotherBug(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return mistake + 1; // eslint-disable-line no-undef
    case 'DECREMENT': return state - 1;
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
    store = createStore(counter, instrument());
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
    let storeWithBug = createStore(counterWithBug, instrument());

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
    expect(spy.calls[0].arguments[0].toString()).toMatch(
      /ReferenceError/
    );

    spy.restore();
  });

  it('should catch invalid action type', () => {
    expect(() => {
      store.dispatch({ type: undefined });
    }).toThrow(
      'Actions may not have an undefined "type" property. ' +
      'Have you misspelled a constant?'
    );
  });

  it('should return the last non-undefined state from getState', () => {
    let storeWithBug = createStore(counterWithBug, instrument());
    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });
    expect(storeWithBug.getState()).toBe(2);

    storeWithBug.dispatch({ type: 'SET_UNDEFINED' });
    expect(storeWithBug.getState()).toBe(2);
  });

  it('should not recompute states on every action', () => {
    let reducerCalls = 0;
    let monitoredStore = createStore(() => reducerCalls++, instrument());
    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);
  });

  it('should not recompute old states when toggling an action', () => {
    let reducerCalls = 0;
    let monitoredStore = createStore(() => reducerCalls++, instrument());
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
    let monitoredStore = createStore(() => reducerCalls++, instrument());
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
    let monitoredStore = createStore(() => reducerCalls++, instrument());
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

  describe('maxAge option', () => {
    let configuredStore;
    let configuredLiftedStore;

    beforeEach(() => {
      configuredStore = createStore(counter, instrument(undefined, { maxAge: 3 }));
      configuredLiftedStore = configuredStore.liftedStore;
    });

    it('should auto-commit earliest non-@@INIT action when maxAge is reached', () => {
      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredStore.dispatch({ type: 'INCREMENT' });
      let liftedStoreState = configuredLiftedStore.getState();

      expect(configuredStore.getState()).toBe(2);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.committedState).toBe(undefined);
      expect(liftedStoreState.stagedActionIds).toInclude(1);

      // Trigger auto-commit.
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();

      expect(configuredStore.getState()).toBe(3);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.stagedActionIds).toExclude(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(2);
    });

    it('should remove skipped actions once committed', () => {
      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredLiftedStore.dispatch(ActionCreators.toggleAction(1));
      configuredStore.dispatch({ type: 'INCREMENT' });
      expect(configuredLiftedStore.getState().skippedActionIds).toInclude(1);
      configuredStore.dispatch({ type: 'INCREMENT' });
      expect(configuredLiftedStore.getState().skippedActionIds).toExclude(1);
    });

    it('should not auto-commit errors', () => {
      let spy = spyOn(console, 'error');

      let storeWithBug = createStore(counterWithBug, instrument(undefined, { maxAge: 3 }));
      let liftedStoreWithBug = storeWithBug.liftedStore;
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'INCREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds.length).toBe(3);

      storeWithBug.dispatch({ type: 'INCREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds.length).toBe(4);

      spy.restore();
    });

    it('should auto-commit actions after hot reload fixes error', () => {
      let spy = spyOn(console, 'error');

      let storeWithBug = createStore(counterWithBug, instrument(undefined, { maxAge: 3 }));
      let liftedStoreWithBug = storeWithBug.liftedStore;
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'INCREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds.length).toBe(7);

      // Auto-commit 2 actions by "fixing" reducer bug, but introducing another.
      storeWithBug.replaceReducer(counterWithAnotherBug);
      expect(liftedStoreWithBug.getState().stagedActionIds.length).toBe(5);

      // Auto-commit 2 more actions by "fixing" other reducer bug.
      storeWithBug.replaceReducer(counter);
      expect(liftedStoreWithBug.getState().stagedActionIds.length).toBe(3);

      spy.restore();
    });

    it('should update currentStateIndex when auto-committing', () => {
      let liftedStoreState;
      let currentComputedState;

      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();
      expect(liftedStoreState.currentStateIndex).toBe(2);

      // currentStateIndex should stay at 2 as actions are committed.
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();
      currentComputedState = liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toBe(3);
    });

    it('should continue to increment currentStateIndex while error blocks commit', () => {
      let spy = spyOn(console, 'error');

      let storeWithBug = createStore(counterWithBug, instrument(undefined, { maxAge: 3 }));
      let liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });

      let liftedStoreState = liftedStoreWithBug.getState();
      let currentComputedState = liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(4);
      expect(currentComputedState.state).toBe(0);
      expect(currentComputedState.error).toExist();

      spy.restore();
    });

    it('should adjust currentStateIndex correctly when multiple actions are committed', () => {
      let spy = spyOn(console, 'error');

      let storeWithBug = createStore(counterWithBug, instrument(undefined, { maxAge: 3 }));
      let liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });

      // Auto-commit 2 actions by "fixing" reducer bug.
      storeWithBug.replaceReducer(counter);
      let liftedStoreState = liftedStoreWithBug.getState();
      let currentComputedState = liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toBe(-4);

      spy.restore();
    });

    it('should not allow currentStateIndex to drop below 0', () => {
      let spy = spyOn(console, 'error');

      let storeWithBug = createStore(counterWithBug, instrument(undefined, { maxAge: 3 }));
      let liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      liftedStoreWithBug.dispatch(ActionCreators.jumpToState(1));

      // Auto-commit 2 actions by "fixing" reducer bug.
      storeWithBug.replaceReducer(counter);
      let liftedStoreState = liftedStoreWithBug.getState();
      let currentComputedState = liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(0);
      expect(currentComputedState.state).toBe(-2);

      spy.restore();
    });
  });

  describe('Import State', () => {
    let monitoredStore;
    let monitoredLiftedStore;
    let exportedState;

    beforeEach(() => {
      monitoredStore = createStore(counter, instrument());
      monitoredLiftedStore = monitoredStore.liftedStore;
      // Set up state to export
      monitoredStore.dispatch({ type: 'INCREMENT' });
      monitoredStore.dispatch({ type: 'INCREMENT' });
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
    });

    it('should replay all the steps when a state is imported', () => {
      let importMonitoredStore = createStore(counter, instrument());
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(exportedState));
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      let importMonitoredStore = createStore(counter, instrument());
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(exportedState));
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });
  });

  it('throws if reducer is not a function', () => {
    expect(() =>
      createStore(undefined, instrument())
    ).toThrow('Expected the reducer to be a function.');
  });

  it('warns if the reducer is not a function but has a default field that is', () => {
    expect(() =>
      createStore(({ 'default': () => {} }), instrument())
    ).toThrow(
      'Expected the reducer to be a function. ' +
      'Instead got an object with a "default" field. ' +
      'Did you pass a module instead of the default export? ' +
      'Try passing require(...).default instead.'
    );
  });

  it('throws if there are more than one instrument enhancer included', () => {
    expect(() => {
      createStore(counter, compose(instrument(), instrument()));
    }).toThrow(
      'DevTools instrumentation should not be applied more than once. ' +
      'Check your store configuration.'
    );
  });
});
