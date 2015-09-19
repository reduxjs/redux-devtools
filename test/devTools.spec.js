import expect, { spyOn } from 'expect';
import { createStore } from 'redux';
import devTools, { ActionCreators } from '../src/devTools';

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

describe('devTools', () => {
  let store;
  let devToolsStore;

  beforeEach(() => {
    store = devTools()(createStore)(counter);
    devToolsStore = store.devToolsStore;
  });

  it('performs actions', () => {
    expect(store.getState()).toBe(0);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);
  });

  it('rollbacks state to the last committed state', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.commit());
    expect(store.getState()).toBe(2);

    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(4);

    devToolsStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(2);

    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toBe(1);

    devToolsStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(2);
  });

  it('resets to initial state', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    devToolsStore.dispatch(ActionCreators.commit());
    expect(store.getState()).toBe(1);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.rollback());
    expect(store.getState()).toBe(1);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.reset());
    expect(store.getState()).toBe(0);
  });

  it('toggles an action', () => {
    // stateIndex 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    devToolsStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(1);
  });

  it('sweeps disabled actions', () => {
    // stateIndex 0 = @@INIT
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(3);

    devToolsStore.dispatch(ActionCreators.sweep());
    expect(store.getState()).toBe(3);

    devToolsStore.dispatch(ActionCreators.toggleAction(2));
    expect(store.getState()).toBe(2);

    devToolsStore.dispatch(ActionCreators.sweep());
    expect(store.getState()).toBe(2);
  });

  it('jumps to state', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    devToolsStore.dispatch(ActionCreators.jumpToState(0));
    expect(store.getState()).toBe(0);

    devToolsStore.dispatch(ActionCreators.jumpToState(1));
    expect(store.getState()).toBe(1);

    devToolsStore.dispatch(ActionCreators.jumpToState(2));
    expect(store.getState()).toBe(0);

    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(0);

    devToolsStore.dispatch(ActionCreators.jumpToState(4));
    expect(store.getState()).toBe(2);
  });

  it('sets monitor state', () => {
    devToolsStore.dispatch(ActionCreators.setMonitorState({test: 'test'}));
    expect(devToolsStore.getState().monitorState.test).toBe('test');
  });

  it('recomputes', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    let devStoreState = store.devToolsStore.getState();
    devStoreState.committedState = 10;
    devStoreState.stagedActions[2] = { type: 'INCREMENT' };

    devToolsStore.dispatch(ActionCreators.recomputeStates(
      devStoreState.committedState,
      devStoreState.stagedActions
    ));

    expect(store.getState()).toBe(13);
  });

  it('gets the reducer', () => {
    expect(store.getReducer()).toBe(counter);
  });

  it('replaces the reducer', () => {
    store.dispatch({ type: 'INCREMENT' });
    store.dispatch({ type: 'DECREMENT' });
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(1);

    store.replaceReducer(doubleCounter);
    expect(store.getState()).toBe(2);
  });

  it('catches and records errors', () => {
    let spy = spyOn(console, 'error');
    let storeWithBug = devTools()(createStore)(counterWithBug);

    storeWithBug.dispatch({ type: 'INCREMENT' });
    storeWithBug.dispatch({ type: 'DECREMENT' });
    storeWithBug.dispatch({ type: 'INCREMENT' });

    let devStoreState = storeWithBug.devToolsStore.getState();
    expect(devStoreState.computedStates[2].error).toMatch(
      /ReferenceError/
    );
    expect(devStoreState.computedStates[3].error).toMatch(
      /Interrupted by an error up the chain/
    );
    expect(spy.calls[0].arguments[0]).toMatch(
      /ReferenceError/
    );
    spy.restore();
  });
});
