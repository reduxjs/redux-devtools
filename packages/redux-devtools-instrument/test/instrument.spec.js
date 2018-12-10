import expect, { spyOn } from 'expect';
import { createStore, compose } from 'redux';
import instrument, { ActionCreators } from '../src/instrument';
import { Observable } from 'rxjs';
import _ from 'lodash';

import 'rxjs/add/observable/from';

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

function counterWithMultiply(state = 0, action) {
  switch (action.type) {
    case 'INCREMENT': return state + 1;
    case 'DECREMENT': return state - 1;
    case 'MULTIPLY': return state * 2;
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

  it('should provide observable', () => {
    let lastValue;
    let calls = 0;

    Observable.from(store)
        .subscribe(state => {
          lastValue = state;
          calls++;
        });

    expect(lastValue).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    expect(lastValue).toBe(1);
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

  it('should set multiple action skip', () => {
    // actionId 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(3);

    liftedStore.dispatch(ActionCreators.setActionsActive(1, 3, false));
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.setActionsActive(0, 2, true));
    expect(store.getState()).toBe(2);

    liftedStore.dispatch(ActionCreators.setActionsActive(0, 1, true));
    expect(store.getState()).toBe(2);
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

  it('should jump to action', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.jumpToAction(0));
    expect(store.getState()).toBe(0);

    liftedStore.dispatch(ActionCreators.jumpToAction(1));
    expect(store.getState()).toBe(1);

    liftedStore.dispatch(ActionCreators.jumpToAction(10));
    expect(store.getState()).toBe(1);
  });

  it('should reorder actions', () => {
    store = createStore(counterWithMultiply, instrument());
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'MULTIPLY' });
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 1, 2, 3, 4]);
    expect(store.getState()).toBe(2);

    store.liftedStore.dispatch(ActionCreators.reorderAction(4, 1));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 4, 1, 2, 3]);
    expect(store.getState()).toBe(1);

    store.liftedStore.dispatch(ActionCreators.reorderAction(4, 1));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 4, 1, 2, 3]);
    expect(store.getState()).toBe(1);

    store.liftedStore.dispatch(ActionCreators.reorderAction(4, 2));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 1, 4, 2, 3]);
    expect(store.getState()).toBe(2);

    store.liftedStore.dispatch(ActionCreators.reorderAction(1, 10));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 4, 2, 3, 1]);
    expect(store.getState()).toBe(1);

    store.liftedStore.dispatch(ActionCreators.reorderAction(10, 1));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 4, 2, 3, 1]);
    expect(store.getState()).toBe(1);

    store.liftedStore.dispatch(ActionCreators.reorderAction(1, -2));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 1, 4, 2, 3]);
    expect(store.getState()).toBe(2);

    store.liftedStore.dispatch(ActionCreators.reorderAction(0, 1));
    expect(store.liftedStore.getState().stagedActionIds).toEqual([0, 1, 4, 2, 3]);
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

  it('should replace the reducer without recomputing actions', () => {
    store = createStore(counter, instrument(undefined, { shouldHotReload: false }));
    expect(store.getState()).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    store.replaceReducer(doubleCounter);
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(3);

    store.replaceReducer(() => ({ test: true }));
    expect(store.getState()).toEqual({ test: true });
  });

  it('should catch and record errors', () => {
    let spy = spyOn(console, 'error');
    let storeWithBug = createStore(
      counterWithBug,
      instrument(undefined, { shouldCatchErrors: true })
    );

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

  it('should catch invalid action type', () => {
    function ActionClass() {
      this.type = 'test';
    }

    expect(() => {
      store.dispatch(new ActionClass());
    }).toThrow(
      'Actions must be plain objects. ' +
      'Use custom middleware for async actions.'
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

      let storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true })
      );
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

      let storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true })
      );
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

      let storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true })
      );
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

      let storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true })
      );
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

      let storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true })
      );
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

    it('should use dynamic maxAge', () => {
      let max = 3;
      const getMaxAge = expect.createSpy().andCall(() => max);
      store = createStore(counter, instrument(undefined, { maxAge: getMaxAge }));

      expect(getMaxAge.calls.length).toEqual(1);
      store.dispatch({ type: 'INCREMENT' });
      expect(getMaxAge.calls.length).toEqual(2);
      store.dispatch({ type: 'INCREMENT' });
      expect(getMaxAge.calls.length).toEqual(3);
      let liftedStoreState = store.liftedStore.getState();

      expect(getMaxAge.calls[0].arguments[0].type).toInclude('INIT');
      expect(getMaxAge.calls[0].arguments[1]).toBe(undefined);
      expect(getMaxAge.calls[1].arguments[0].type).toBe('PERFORM_ACTION');
      expect(getMaxAge.calls[1].arguments[1].nextActionId).toBe(1);
      expect(getMaxAge.calls[1].arguments[1].stagedActionIds).toEqual([0]);
      expect(getMaxAge.calls[2].arguments[1].nextActionId).toBe(2);
      expect(getMaxAge.calls[2].arguments[1].stagedActionIds).toEqual([0, 1]);

      expect(store.getState()).toBe(2);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.committedState).toBe(undefined);
      expect(liftedStoreState.stagedActionIds).toInclude(1);

      // Trigger auto-commit.
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(3);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.stagedActionIds).toExclude(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(2);

      max = 4;
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(4);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(4);
      expect(liftedStoreState.stagedActionIds).toExclude(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(3);

      max = 3;
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(5);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.stagedActionIds).toExclude(1);
      expect(liftedStoreState.computedStates[0].state).toBe(3);
      expect(liftedStoreState.committedState).toBe(3);
      expect(liftedStoreState.currentStateIndex).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(6);
      expect(Object.keys(liftedStoreState.actionsById).length).toBe(3);
      expect(liftedStoreState.stagedActionIds).toExclude(1);
      expect(liftedStoreState.computedStates[0].state).toBe(4);
      expect(liftedStoreState.committedState).toBe(4);
      expect(liftedStoreState.currentStateIndex).toBe(2);
    });

    it('should throw error when maxAge < 2', () => {
      expect(() => {
        createStore(counter, instrument(undefined, { maxAge: 1 }));
      }).toThrow(/may not be less than 2/);
    });
  });

  describe('trace option', () => {
    let monitoredStore;
    let monitoredLiftedStore;
    let exportedState;

    it('should not include stack trace', () => {
      monitoredStore = createStore(counter, instrument());
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBe(undefined);
      expect(exportedState.actionsById[1].stack).toBe(undefined);
    });

    it('should include stack trace', () => {
      monitoredStore = createStore(counter, instrument(undefined, { trace: true }));
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBe(undefined);
      expect(exportedState.actionsById[1].stack).toBeA('string');
      expect(exportedState.actionsById[1].stack).toMatch(/^Error/);
      expect(exportedState.actionsById[1].stack).toNotMatch(/instrument.js/);
      expect(exportedState.actionsById[1].stack).toContain('instrument.spec.js');
      expect(exportedState.actionsById[1].stack).toContain('/mocha/');
    });

    it('should get stack trace from a function', () => {
      const traceFn = () => new Error().stack;
      monitoredStore = createStore(counter, instrument(undefined, { trace: traceFn }));
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBe(undefined);
      expect(exportedState.actionsById[1].stack).toBeA('string');
      expect(exportedState.actionsById[1].stack).toContain('at Object.performAction');
      expect(exportedState.actionsById[1].stack).toContain('instrument.js');
      expect(exportedState.actionsById[1].stack).toContain('instrument.spec.js');
      expect(exportedState.actionsById[1].stack).toContain('/mocha/');
    });

    it('should get stack trace inside setTimeout using a function', (done) => {
      const stack = new Error().stack;
      setTimeout(() => {
        const traceFn = () => stack + new Error().stack;
        monitoredStore = createStore(counter, instrument(undefined, { trace: traceFn }));
        monitoredLiftedStore = monitoredStore.liftedStore;
        monitoredStore.dispatch({ type: 'INCREMENT' });

        exportedState = monitoredLiftedStore.getState();
        expect(exportedState.actionsById[0].stack).toBe(undefined);
        expect(exportedState.actionsById[1].stack).toBeA('string');
        expect(exportedState.actionsById[1].stack).toContain('at Object.performAction');
        expect(exportedState.actionsById[1].stack).toContain('instrument.js');
        expect(exportedState.actionsById[1].stack).toContain('instrument.spec.js');
        expect(exportedState.actionsById[1].stack).toContain('/mocha/');
        done();
      });
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

    it('should allow for state to be imported without replaying actions', () => {
      let importMonitoredStore = createStore(counter, instrument());
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      let noComputedExportedState = Object.assign({}, exportedState);
      delete noComputedExportedState.computedStates;

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(noComputedExportedState, true));

      let expectedImportedState = Object.assign({}, noComputedExportedState, {
        computedStates: undefined
      });
      expect(importMonitoredLiftedStore.getState()).toEqual(expectedImportedState);
    });

    it('should include stack trace', () => {
      let importMonitoredStore = createStore(counter, instrument(undefined, { trace: true }));
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      const oldState = importMonitoredLiftedStore.getState();
      expect(oldState.actionsById[0].stack).toBe(undefined);
      expect(oldState.actionsById[1].stack).toBeA('string');

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(oldState));
      expect(importMonitoredLiftedStore.getState()).toEqual(oldState);
      expect(importMonitoredLiftedStore.getState().actionsById[0].stack).toBe(undefined);
      expect(importMonitoredLiftedStore.getState().actionsById[1]).toEqual(oldState.actionsById[1]);
    });
  });

  function filterStackAndTimestamps(state) {
    state.actionsById = _.mapValues(state.actionsById, (action) => {
      delete action.timestamp;
      delete action.stack;
      return action;
    });
    return state;
  }

  describe('Import Actions', () => {
    let monitoredStore;
    let monitoredLiftedStore;
    let exportedState;
    let savedActions = [
      { type: 'INCREMENT' },
      { type: 'INCREMENT' },
      { type: 'INCREMENT' }
    ];

    beforeEach(() => {
      monitoredStore = createStore(counter, instrument());
      monitoredLiftedStore = monitoredStore.liftedStore;
      // Pass actions through component
      savedActions.forEach(action => monitoredStore.dispatch(action));
      // get the final state
      exportedState = filterStackAndTimestamps(monitoredLiftedStore.getState());
    });

    it('should replay all the steps when a state is imported', () => {
      let importMonitoredStore = createStore(counter, instrument());
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(savedActions));
      expect(filterStackAndTimestamps(importMonitoredLiftedStore.getState())).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      let importMonitoredStore = createStore(counter, instrument());
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(savedActions));
      expect(filterStackAndTimestamps(importMonitoredLiftedStore.getState())).toEqual(exportedState);
    });

    it('should include stack trace', () => {
      let importMonitoredStore = createStore(counter, instrument(undefined, { trace: true }));
      let importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(savedActions));
      expect(importMonitoredLiftedStore.getState().actionsById[0].stack).toBe(undefined);
      expect(importMonitoredLiftedStore.getState().actionsById[1].stack).toBeA('string');
      expect(filterStackAndTimestamps(importMonitoredLiftedStore.getState())).toEqual(exportedState);
    });
  });

  describe('Lock Changes', () => {
    it('should lock', () => {
      store.dispatch({ type: 'INCREMENT' });
      store.liftedStore.dispatch({ type: 'LOCK_CHANGES', status: true });
      expect(store.liftedStore.getState().isLocked).toBe(true);
      expect(store.liftedStore.getState().nextActionId).toBe(2);
      expect(store.getState()).toBe(1);

      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(2);
      expect(store.getState()).toBe(1);

      liftedStore.dispatch(ActionCreators.toggleAction(1));
      expect(store.getState()).toBe(0);
      liftedStore.dispatch(ActionCreators.toggleAction(1));
      expect(store.getState()).toBe(1);

      store.liftedStore.dispatch({ type: 'LOCK_CHANGES', status: false });
      expect(store.liftedStore.getState().isLocked).toBe(false);
      expect(store.liftedStore.getState().nextActionId).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.getState()).toBe(2);
    });
    it('should start locked', () => {
      store = createStore(counter, instrument(undefined, { shouldStartLocked: true }));
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().isLocked).toBe(true);
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.getState()).toBe(0);

      const savedActions = [{ type: 'INCREMENT' }, { type: 'INCREMENT' }];
      store.liftedStore.dispatch(ActionCreators.importState(savedActions));
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.getState()).toBe(2);

      store.liftedStore.dispatch({ type: 'LOCK_CHANGES', status: false });
      expect(store.liftedStore.getState().isLocked).toBe(false);

      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(4);
      expect(store.getState()).toBe(3);
    });
  });

  describe('Pause recording', () => {
    it('should pause', () => {
      expect(store.liftedStore.getState().isPaused).toBe(false);
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.getState()).toBe(2);

      store.liftedStore.dispatch(ActionCreators.pauseRecording(true));
      expect(store.liftedStore.getState().isPaused).toBe(true);
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.liftedStore.getState().actionsById[0].action).toEqual({ type: '@@INIT' });
      expect(store.getState()).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.liftedStore.getState().actionsById[0].action).toEqual({ type: '@@INIT' });
      expect(store.getState()).toBe(4);

      store.liftedStore.dispatch(ActionCreators.pauseRecording(false));
      expect(store.liftedStore.getState().isPaused).toBe(false);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.liftedStore.getState().actionsById[2].action).toEqual({ type: 'INCREMENT' });
      expect(store.getState()).toBe(6);
    });
    it('should maintain the history while paused', () => {
      store = createStore(counter, instrument(undefined, { pauseActionType: '@@PAUSED' }));
      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.getState()).toBe(2);
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.liftedStore.getState().isPaused).toBe(false);

      store.liftedStore.dispatch(ActionCreators.pauseRecording(true));
      expect(store.liftedStore.getState().isPaused).toBe(true);
      expect(store.liftedStore.getState().nextActionId).toBe(4);
      expect(store.getState()).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(4);
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(4);
      expect(store.getState()).toBe(4);

      store.liftedStore.dispatch(ActionCreators.pauseRecording(false));
      expect(store.liftedStore.getState().isPaused).toBe(false);
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.getState()).toBe(4);
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(2);
      expect(store.getState()).toBe(5);

      store.liftedStore.dispatch(ActionCreators.commit());
      store.liftedStore.dispatch(ActionCreators.pauseRecording(true));
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.getState()).toBe(6);
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
