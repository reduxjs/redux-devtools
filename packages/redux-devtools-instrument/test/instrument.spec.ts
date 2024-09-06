import {
  createStore,
  compose,
  Reducer,
  Store,
  Action,
  StoreEnhancer,
} from 'redux';
import {
  ActionCreators,
  EnhancedStore,
  instrument,
  LiftedAction,
  LiftedStore,
  LiftedState,
} from '../src/instrument';
import { from, Observable } from 'rxjs';

type CounterAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };
function counter(state = 0, action: CounterAction) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    default:
      return state;
  }
}

type CounterWithBugAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_UNDEFINED' };
function counterWithBug(state = 0, action: CounterWithBugAction) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return mistake - 1;
    case 'SET_UNDEFINED':
      return undefined as unknown as number;
    default:
      return state;
  }
}

type CounterWithAnotherBugAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'SET_UNDEFINED' };
function counterWithAnotherBug(state = 0, action: CounterWithBugAction) {
  switch (action.type) {
    case 'INCREMENT':
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return (mistake as unknown as number) + 1;
    case 'DECREMENT':
      return state - 1;
    case 'SET_UNDEFINED':
      return undefined;
    default:
      return state;
  }
}

type DoubleCounterAction = { type: 'INCREMENT' } | { type: 'DECREMENT' };
function doubleCounter(state = 0, action: DoubleCounterAction) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 2;
    case 'DECREMENT':
      return state - 2;
    default:
      return state;
  }
}

type CounterWithMultiplyAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'MULTIPLY' };
function counterWithMultiply(state = 0, action: CounterWithMultiplyAction) {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1;
    case 'DECREMENT':
      return state - 1;
    case 'MULTIPLY':
      return state * 2;
    default:
      return state;
  }
}

describe('instrument', () => {
  let store: EnhancedStore<number, CounterAction, null>;
  let liftedStore: LiftedStore<number, CounterAction, null>;

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
    // let calls = 0;

    from(store as unknown as Observable<number>).subscribe((state) => {
      lastValue = state;
      // calls++;
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
    const storeWithMultiply = createStore(counterWithMultiply, instrument());
    storeWithMultiply.dispatch({ type: 'INCREMENT' });
    storeWithMultiply.dispatch({ type: 'DECREMENT' });
    storeWithMultiply.dispatch({ type: 'INCREMENT' });
    storeWithMultiply.dispatch({ type: 'MULTIPLY' });
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 1, 2, 3, 4,
    ]);
    expect(storeWithMultiply.getState()).toBe(2);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(4, 1));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 4, 1, 2, 3,
    ]);
    expect(storeWithMultiply.getState()).toBe(1);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(4, 1));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 4, 1, 2, 3,
    ]);
    expect(storeWithMultiply.getState()).toBe(1);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(4, 2));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 1, 4, 2, 3,
    ]);
    expect(storeWithMultiply.getState()).toBe(2);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(1, 10));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 4, 2, 3, 1,
    ]);
    expect(storeWithMultiply.getState()).toBe(1);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(10, 1));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 4, 2, 3, 1,
    ]);
    expect(storeWithMultiply.getState()).toBe(1);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(1, -2));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 1, 4, 2, 3,
    ]);
    expect(storeWithMultiply.getState()).toBe(2);

    storeWithMultiply.liftedStore.dispatch(ActionCreators.reorderAction(0, 1));
    expect(storeWithMultiply.liftedStore.getState().stagedActionIds).toEqual([
      0, 1, 4, 2, 3,
    ]);
    expect(storeWithMultiply.getState()).toBe(2);
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
    store = createStore(
      counter,
      instrument(undefined, { shouldHotReload: false }),
    );
    expect(store.getState()).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    store.replaceReducer(doubleCounter);
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(3);

    store.replaceReducer(
      (() => ({ test: true }) as unknown) as Reducer<number, CounterAction>,
    );
    const newStore = store as unknown as Store<{ test: boolean }>;
    expect(newStore.getState()).toEqual({ test: true });
  });

  it('should catch and record errors', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {
      // noop
    });
    const storeWithBug = createStore(
      counterWithBug,
      instrument(undefined, { shouldCatchErrors: true }),
    );

    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'DECREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });

    const { computedStates } = storeWithBug.liftedStore.getState();
    expect(computedStates[2].error).toMatch(/ReferenceError/);
    expect(computedStates[3].error).toMatch(
      /Interrupted by an error up the chain/,
    );
    expect(spy.mock.calls[0][0].toString()).toMatch(/ReferenceError/);

    spy.mockReset();
  });

  it('should catch invalid action type (undefined type)', () => {
    expect(() => {
      store.dispatch({ type: undefined } as unknown as CounterAction);
    }).toThrow(
      'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?',
    );
  });

  it('should catch invalid action type (function)', () => {
    function ActionClass(this: any) {
      this.type = 'test';
    }

    expect(() => {
      store.dispatch(new (ActionClass as any)() as CounterAction);
    }).toThrow(
      'Actions must be plain objects. ' +
        'Use custom middleware for async actions.',
    );
  });

  it('should return the last non-undefined state from getState', () => {
    const storeWithBug = createStore(counterWithBug, instrument());
    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });
    expect(storeWithBug.getState()).toBe(2);

    storeWithBug.dispatch({ type: 'SET_UNDEFINED' });
    expect(storeWithBug.getState()).toBe(2);
  });

  it('should not recompute states on every action', () => {
    let reducerCalls = 0;
    const monitoredStore = createStore(() => reducerCalls++, instrument());
    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);
  });

  it('should not recompute old states when toggling an action', () => {
    let reducerCalls = 0;
    const monitoredStore = createStore(() => reducerCalls++, instrument());
    const monitoredLiftedStore = monitoredStore.liftedStore;

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
    const monitoredStore = createStore(() => reducerCalls++, instrument());
    const monitoredLiftedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    const savedComputedStates = monitoredLiftedStore.getState().computedStates;

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(0));
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(1));
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch(ActionCreators.jumpToState(3));
    expect(reducerCalls).toBe(4);

    expect(monitoredLiftedStore.getState().computedStates).toBe(
      savedComputedStates,
    );
  });

  it('should not recompute states on monitor actions', () => {
    let reducerCalls = 0;
    const monitoredStore = createStore(() => reducerCalls++, instrument());
    const monitoredLiftedStore = monitoredStore.liftedStore;

    expect(reducerCalls).toBe(1);
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    monitoredStore.dispatch({ type: 'INCREMENT' });
    expect(reducerCalls).toBe(4);

    const savedComputedStates = monitoredLiftedStore.getState().computedStates;

    monitoredLiftedStore.dispatch({ type: 'lol' } as unknown as LiftedAction<
      number,
      Action,
      null
    >);
    expect(reducerCalls).toBe(4);

    monitoredLiftedStore.dispatch({ type: 'wat' } as unknown as LiftedAction<
      number,
      Action,
      null
    >);
    expect(reducerCalls).toBe(4);

    expect(monitoredLiftedStore.getState().computedStates).toBe(
      savedComputedStates,
    );
  });

  describe('maxAge option', () => {
    let configuredStore: EnhancedStore<number, CounterAction, null>;
    let configuredLiftedStore: LiftedStore<number, CounterAction, null>;

    beforeEach(() => {
      configuredStore = createStore(
        counter,
        instrument(undefined, { maxAge: 3 }),
      );
      configuredLiftedStore = configuredStore.liftedStore;
    });

    it('should auto-commit earliest non-@@INIT action when maxAge is reached', () => {
      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredStore.dispatch({ type: 'INCREMENT' });
      let liftedStoreState = configuredLiftedStore.getState();

      expect(configuredStore.getState()).toBe(2);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.committedState).toBeUndefined();
      expect(liftedStoreState.stagedActionIds).toContain(1);

      // Trigger auto-commit.
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();

      expect(configuredStore.getState()).toBe(3);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(2);
    });

    it('should remove skipped actions once committed', () => {
      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredLiftedStore.dispatch(ActionCreators.toggleAction(1));
      configuredStore.dispatch({ type: 'INCREMENT' });
      expect(configuredLiftedStore.getState().skippedActionIds).toContain(1);
      configuredStore.dispatch({ type: 'INCREMENT' });
      expect(configuredLiftedStore.getState().skippedActionIds).not.toContain(
        1,
      );
    });

    it('should not auto-commit errors', () => {
      const spy = jest.spyOn(console, 'error');

      const storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true }),
      );
      const liftedStoreWithBug = storeWithBug.liftedStore;
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'INCREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds).toHaveLength(3);

      storeWithBug.dispatch({ type: 'INCREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds).toHaveLength(4);

      spy.mockReset();
    });

    it('should auto-commit actions after hot reload fixes error', () => {
      const spy = jest.spyOn(console, 'error');

      const storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true }),
      );
      const liftedStoreWithBug = storeWithBug.liftedStore;
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'INCREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      expect(liftedStoreWithBug.getState().stagedActionIds).toHaveLength(7);

      // Auto-commit 2 actions by "fixing" reducer bug, but introducing another.
      storeWithBug.replaceReducer(
        counterWithAnotherBug as Reducer<number, CounterWithBugAction>,
      );
      const liftedStoreWithAnotherBug =
        liftedStoreWithBug as unknown as LiftedStore<
          number,
          CounterWithAnotherBugAction,
          null
        >;
      expect(liftedStoreWithAnotherBug.getState().stagedActionIds).toHaveLength(
        5,
      );

      // Auto-commit 2 more actions by "fixing" other reducer bug.
      storeWithBug.replaceReducer(
        counter as Reducer<number, CounterWithBugAction>,
      );
      const liftedStore = liftedStoreWithBug as LiftedStore<
        number,
        CounterAction,
        null
      >;
      expect(liftedStore.getState().stagedActionIds).toHaveLength(3);

      spy.mockReset();
    });

    it('should update currentStateIndex when auto-committing', () => {
      let liftedStoreState;

      configuredStore.dispatch({ type: 'INCREMENT' });
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();
      expect(liftedStoreState.currentStateIndex).toBe(2);

      // currentStateIndex should stay at 2 as actions are committed.
      configuredStore.dispatch({ type: 'INCREMENT' });
      liftedStoreState = configuredLiftedStore.getState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toBe(3);
    });

    it('should continue to increment currentStateIndex while error blocks commit', () => {
      const spy = jest.spyOn(console, 'error');

      const storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true }),
      );
      const liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });

      const liftedStoreState = liftedStoreWithBug.getState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(4);
      expect(currentComputedState.state).toBe(0);
      expect(currentComputedState.error).toBeTruthy();

      spy.mockReset();
    });

    it('should adjust currentStateIndex correctly when multiple actions are committed', () => {
      const spy = jest.spyOn(console, 'error');

      const storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true }),
      );
      const liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });

      // Auto-commit 2 actions by "fixing" reducer bug.
      storeWithBug.replaceReducer(
        counter as Reducer<number, CounterWithBugAction>,
      );
      const liftedStore = liftedStoreWithBug as LiftedStore<
        number,
        CounterAction,
        null
      >;
      const liftedStoreState = liftedStore.getState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(2);
      expect(currentComputedState.state).toBe(-4);

      spy.mockReset();
    });

    it('should not allow currentStateIndex to drop below 0', () => {
      const spy = jest.spyOn(console, 'error');

      const storeWithBug = createStore(
        counterWithBug,
        instrument(undefined, { maxAge: 3, shouldCatchErrors: true }),
      );
      const liftedStoreWithBug = storeWithBug.liftedStore;

      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      storeWithBug.dispatch({ type: 'DECREMENT' });
      liftedStoreWithBug.dispatch(ActionCreators.jumpToState(1));

      // Auto-commit 2 actions by "fixing" reducer bug.
      storeWithBug.replaceReducer(
        counter as Reducer<number, CounterWithBugAction>,
      );
      const liftedStore = liftedStoreWithBug as LiftedStore<
        number,
        CounterAction,
        null
      >;
      const liftedStoreState = liftedStore.getState();
      const currentComputedState =
        liftedStoreState.computedStates[liftedStoreState.currentStateIndex];
      expect(liftedStoreState.currentStateIndex).toBe(0);
      expect(currentComputedState.state).toBe(-2);

      spy.mockReset();
    });

    it('should use dynamic maxAge', () => {
      let max = 3;
      const getMaxAge = jest.fn().mockImplementation(() => max);
      store = createStore(
        counter,
        instrument(undefined, { maxAge: getMaxAge }),
      );

      expect(getMaxAge.mock.calls).toHaveLength(1);
      store.dispatch({ type: 'INCREMENT' });
      expect(getMaxAge.mock.calls).toHaveLength(2);
      store.dispatch({ type: 'INCREMENT' });
      expect(getMaxAge.mock.calls).toHaveLength(3);
      let liftedStoreState = store.liftedStore.getState();

      expect(getMaxAge.mock.calls[0][0].type).toContain('INIT');
      expect(getMaxAge.mock.calls[0][1]).toBeUndefined();
      expect(getMaxAge.mock.calls[1][0].type).toBe('PERFORM_ACTION');
      expect(getMaxAge.mock.calls[1][1].nextActionId).toBe(1);
      expect(getMaxAge.mock.calls[1][1].stagedActionIds).toEqual([0]);
      expect(getMaxAge.mock.calls[2][1].nextActionId).toBe(2);
      expect(getMaxAge.mock.calls[2][1].stagedActionIds).toEqual([0, 1]);

      expect(store.getState()).toBe(2);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.committedState).toBeUndefined();
      expect(liftedStoreState.stagedActionIds).toContain(1);

      // Trigger auto-commit.
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(3);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(2);

      max = 4;
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(4);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(4);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
      expect(liftedStoreState.computedStates[0].state).toBe(1);
      expect(liftedStoreState.committedState).toBe(1);
      expect(liftedStoreState.currentStateIndex).toBe(3);

      max = 3;
      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(5);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
      expect(liftedStoreState.computedStates[0].state).toBe(3);
      expect(liftedStoreState.committedState).toBe(3);
      expect(liftedStoreState.currentStateIndex).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      liftedStoreState = store.liftedStore.getState();

      expect(store.getState()).toBe(6);
      expect(Object.keys(liftedStoreState.actionsById)).toHaveLength(3);
      expect(liftedStoreState.stagedActionIds).not.toContain(1);
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
      expect(exportedState.actionsById[0].stack).toBeUndefined();
      expect(exportedState.actionsById[1].stack).toBeUndefined();
    });

    it('should include stack trace', () => {
      function fn1() {
        monitoredStore = createStore(
          counter,
          instrument(undefined, { trace: true }),
        );
        monitoredLiftedStore = monitoredStore.liftedStore;
        monitoredStore.dispatch({ type: 'INCREMENT' });

        exportedState = monitoredLiftedStore.getState();
        expect(exportedState.actionsById[0].stack).toBeUndefined();
        expect(typeof exportedState.actionsById[1].stack).toBe('string');
        expect(exportedState.actionsById[1].stack).toMatch(/^Error/);
        expect(exportedState.actionsById[1].stack).not.toMatch(/instrument.ts/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn1\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn2\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn3\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn4\b/);
        expect(exportedState.actionsById[1].stack).toContain(
          'instrument.spec.ts',
        );
        expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
          10 + 1,
        ); // +1 is for `Error\n`
      }

      function fn2() {
        return fn1();
      }

      function fn3() {
        return fn2();
      }

      function fn4() {
        return fn3();
      }

      fn4();
    });

    it('should include only 3 frames for stack trace', () => {
      function fn1() {
        monitoredStore = createStore(
          counter,
          instrument(undefined, { trace: true, traceLimit: 3 }),
        );
        monitoredLiftedStore = monitoredStore.liftedStore;
        monitoredStore.dispatch({ type: 'INCREMENT' });

        exportedState = monitoredLiftedStore.getState();
        expect(exportedState.actionsById[0].stack).toBeUndefined();
        expect(typeof exportedState.actionsById[1].stack).toBe('string');
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn1\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn2\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn3\b/);
        expect(exportedState.actionsById[1].stack).not.toMatch(/\bfn4\b/);
        expect(exportedState.actionsById[1].stack).toContain(
          'instrument.spec.ts',
        );
        expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
          3 + 1,
        );
      }

      function fn2() {
        return fn1();
      }

      function fn3() {
        return fn2();
      }

      function fn4() {
        return fn3();
      }

      fn4();
    });

    it('should force traceLimit value of 3 when Error.stackTraceLimit is 10', () => {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 10;

      function fn1() {
        monitoredStore = createStore(
          counter,
          instrument(undefined, { trace: true, traceLimit: 3 }),
        );
        monitoredLiftedStore = monitoredStore.liftedStore;
        monitoredStore.dispatch({ type: 'INCREMENT' });

        exportedState = monitoredLiftedStore.getState();
        expect(exportedState.actionsById[0].stack).toBeUndefined();
        expect(typeof exportedState.actionsById[1].stack).toBe('string');
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn1\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn2\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn3\b/);
        expect(exportedState.actionsById[1].stack).not.toMatch(/\bfn4\b/);
        expect(exportedState.actionsById[1].stack).toContain(
          'instrument.spec.ts',
        );
        expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
          3 + 1,
        );
      }

      function fn2() {
        return fn1();
      }

      function fn3() {
        return fn2();
      }

      function fn4() {
        return fn3();
      }

      fn4();
      Error.stackTraceLimit = stackTraceLimit;
    });

    it('should force traceLimit value of 5 even when Error.stackTraceLimit is 2', () => {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 2;
      monitoredStore = createStore(
        counter,
        instrument(undefined, { trace: true, traceLimit: 5 }),
      );
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });
      Error.stackTraceLimit = stackTraceLimit;

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBeUndefined();
      expect(typeof exportedState.actionsById[1].stack).toBe('string');
      expect(exportedState.actionsById[1].stack).toMatch(/^Error/);
      expect(exportedState.actionsById[1].stack).toContain(
        'instrument.spec.ts',
      );
      expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
        5 + 1,
      );
    });

    it('should force default limit of 10 even when Error.stackTraceLimit is 3', () => {
      const stackTraceLimit = Error.stackTraceLimit;
      Error.stackTraceLimit = 3;

      function fn1() {
        monitoredStore = createStore(
          counter,
          instrument(undefined, { trace: true }),
        );
        monitoredLiftedStore = monitoredStore.liftedStore;
        monitoredStore.dispatch({ type: 'INCREMENT' });
        Error.stackTraceLimit = stackTraceLimit;

        exportedState = monitoredLiftedStore.getState();
        expect(exportedState.actionsById[0].stack).toBeUndefined();
        expect(typeof exportedState.actionsById[1].stack).toBe('string');
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn1\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn2\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn3\b/);
        expect(exportedState.actionsById[1].stack).toMatch(/\bfn4\b/);
        expect(exportedState.actionsById[1].stack).toContain(
          'instrument.spec.ts',
        );
        expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
          10 + 1,
        );
      }

      function fn2() {
        return fn1();
      }

      function fn3() {
        return fn2();
      }

      function fn4() {
        return fn3();
      }

      fn4();
    });

    it('should include 3 extra frames when Error.captureStackTrace not suported', () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const captureStackTrace = Error.captureStackTrace;
      Error.captureStackTrace = undefined as unknown as () => unknown;
      monitoredStore = createStore(
        counter,
        instrument(undefined, { trace: true, traceLimit: 5 }),
      );
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });
      Error.captureStackTrace = captureStackTrace;

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBeUndefined();
      expect(typeof exportedState.actionsById[1].stack).toBe('string');
      expect(exportedState.actionsById[1].stack).toMatch(/^Error/);
      expect(exportedState.actionsById[1].stack).toContain('instrument.ts');
      expect(exportedState.actionsById[1].stack).toContain(
        'instrument.spec.ts',
      );
      expect(exportedState.actionsById[1].stack!.split('\n')).toHaveLength(
        5 + 3 + 1,
      );
    });

    it('should get stack trace from a function', () => {
      const traceFn = () => new Error().stack;
      monitoredStore = createStore(
        counter,
        instrument(undefined, { trace: traceFn }),
      );
      monitoredLiftedStore = monitoredStore.liftedStore;
      monitoredStore.dispatch({ type: 'INCREMENT' });

      exportedState = monitoredLiftedStore.getState();
      expect(exportedState.actionsById[0].stack).toBeUndefined();
      expect(typeof exportedState.actionsById[1].stack).toBe('string');
      expect(exportedState.actionsById[1].stack).toContain(
        'at Object.performAction',
      );
      expect(exportedState.actionsById[1].stack).toContain('instrument.ts');
      expect(exportedState.actionsById[1].stack).toContain(
        'instrument.spec.ts',
      );
    });

    it('should get stack trace inside setTimeout using a function', () =>
      new Promise<void>((done) => {
        const stack = new Error().stack;
        setTimeout(() => {
          const traceFn = () => stack! + new Error().stack!;
          monitoredStore = createStore(
            counter,
            instrument(undefined, { trace: traceFn }),
          );
          monitoredLiftedStore = monitoredStore.liftedStore;
          monitoredStore.dispatch({ type: 'INCREMENT' });

          exportedState = monitoredLiftedStore.getState();
          expect(exportedState.actionsById[0].stack).toBeUndefined();
          expect(typeof exportedState.actionsById[1].stack).toBe('string');
          expect(exportedState.actionsById[1].stack).toContain(
            'at Object.performAction',
          );
          expect(exportedState.actionsById[1].stack).toContain('instrument.ts');
          expect(exportedState.actionsById[1].stack).toContain(
            'instrument.spec.ts',
          );
          done();
        });
      }));
  });

  describe('Import State', () => {
    let monitoredStore: EnhancedStore<number, CounterAction, null>;
    let monitoredLiftedStore: LiftedStore<number, CounterAction, null>;
    let exportedState: LiftedState<number, CounterAction, null>;

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
      const importMonitoredStore = createStore(counter, instrument());
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(exportedState),
      );
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      const importMonitoredStore = createStore(counter, instrument());
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(exportedState),
      );
      expect(importMonitoredLiftedStore.getState()).toEqual(exportedState);
    });

    it('should allow for state to be imported without replaying actions', () => {
      const importMonitoredStore = createStore(counter, instrument());
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      const noComputedExportedState = Object.assign({}, exportedState);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete noComputedExportedState.computedStates;

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(noComputedExportedState, true),
      );

      const expectedImportedState = Object.assign({}, noComputedExportedState, {
        computedStates: undefined,
      });
      expect(importMonitoredLiftedStore.getState()).toEqual(
        expectedImportedState,
      );
    });

    it('should include stack trace', () => {
      const importMonitoredStore = createStore(
        counter,
        instrument(undefined, { trace: true }),
      );
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      const oldState = importMonitoredLiftedStore.getState();
      expect(oldState.actionsById[0].stack).toBeUndefined();
      expect(typeof oldState.actionsById[1].stack).toBe('string');

      importMonitoredLiftedStore.dispatch(ActionCreators.importState(oldState));
      expect(importMonitoredLiftedStore.getState()).toEqual(oldState);
      expect(
        importMonitoredLiftedStore.getState().actionsById[0].stack,
      ).toBeUndefined();
      expect(importMonitoredLiftedStore.getState().actionsById[1]).toEqual(
        oldState.actionsById[1],
      );
    });
  });

  function filterStackAndTimestamps<S, A extends Action<string>>(
    state: LiftedState<S, A, null>,
  ) {
    state.actionsById = Object.fromEntries(
      Object.entries(state.actionsById).map(([actionId, action]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete action.timestamp;
        delete action.stack;
        return [actionId, action];
      }),
    );
    return state;
  }

  describe('Import Actions', () => {
    let monitoredStore: EnhancedStore<number, CounterAction, null>;
    let monitoredLiftedStore: LiftedStore<number, CounterAction, null>;
    let exportedState: LiftedState<number, CounterAction, null>;
    const savedActions = [
      { type: 'INCREMENT' },
      { type: 'INCREMENT' },
      { type: 'INCREMENT' },
    ] as const;

    beforeEach(() => {
      monitoredStore = createStore(counter, instrument());
      monitoredLiftedStore = monitoredStore.liftedStore;
      // Pass actions through component
      savedActions.forEach((action) => monitoredStore.dispatch(action));
      // get the final state
      exportedState = filterStackAndTimestamps(monitoredLiftedStore.getState());
    });

    it('should replay all the steps when a state is imported', () => {
      const importMonitoredStore = createStore(counter, instrument());
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(savedActions),
      );
      expect(
        filterStackAndTimestamps(importMonitoredLiftedStore.getState()),
      ).toEqual(exportedState);
    });

    it('should replace the existing action log with the one imported', () => {
      const importMonitoredStore = createStore(counter, instrument());
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(savedActions),
      );
      expect(
        filterStackAndTimestamps(importMonitoredLiftedStore.getState()),
      ).toEqual(exportedState);
    });

    it('should include stack trace', () => {
      const importMonitoredStore = createStore(
        counter,
        instrument(undefined, { trace: true }),
      );
      const importMonitoredLiftedStore = importMonitoredStore.liftedStore;

      importMonitoredStore.dispatch({ type: 'DECREMENT' });
      importMonitoredStore.dispatch({ type: 'DECREMENT' });

      importMonitoredLiftedStore.dispatch(
        ActionCreators.importState(savedActions),
      );
      expect(
        importMonitoredLiftedStore.getState().actionsById[0].stack,
      ).toBeUndefined();
      expect(
        typeof importMonitoredLiftedStore.getState().actionsById[1].stack,
      ).toBe('string');
      expect(
        filterStackAndTimestamps(importMonitoredLiftedStore.getState()),
      ).toEqual(exportedState);
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
      store = createStore(
        counter,
        instrument(undefined, { shouldStartLocked: true }),
      );
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().isLocked).toBe(true);
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.getState()).toBe(0);

      const savedActions = [
        { type: 'INCREMENT' },
        { type: 'INCREMENT' },
      ] as const;
      store.liftedStore.dispatch(
        ActionCreators.importState<number, CounterAction, null>(savedActions),
      );
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
      expect(store.liftedStore.getState().actionsById[0].action).toEqual({
        type: '@@INIT',
      });
      expect(store.getState()).toBe(2);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(1);
      expect(store.liftedStore.getState().actionsById[0].action).toEqual({
        type: '@@INIT',
      });
      expect(store.getState()).toBe(4);

      store.liftedStore.dispatch(ActionCreators.pauseRecording(false));
      expect(store.liftedStore.getState().isPaused).toBe(false);

      store.dispatch({ type: 'INCREMENT' });
      store.dispatch({ type: 'INCREMENT' });
      expect(store.liftedStore.getState().nextActionId).toBe(3);
      expect(store.liftedStore.getState().actionsById[2].action).toEqual({
        type: 'INCREMENT',
      });
      expect(store.getState()).toBe(6);
    });
    it('should maintain the history while paused', () => {
      store = createStore(
        counter,
        instrument(undefined, { pauseActionType: '@@PAUSED' }),
      );
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
      createStore(undefined as unknown as Reducer, instrument()),
    ).toThrow(
      "Expected the root reducer to be a function. Instead, received: 'undefined'",
    );
  });

  it('warns if the reducer is not a function but has a default field that is', () => {
    expect(() =>
      createStore(
        {
          default: () => {
            // noop
          },
        } as unknown as Reducer,
        instrument(),
      ),
    ).toThrow(
      "Expected the root reducer to be a function. Instead, received: 'object'",
    );
  });

  it('throws if there are more than one instrument enhancer included', () => {
    expect(() => {
      createStore(
        counter,
        compose(instrument(), instrument()) as StoreEnhancer,
      );
    }).toThrow(
      'DevTools instrumentation should not be applied more than once. ' +
        'Check your store configuration.',
    );
  });
});
