import difference from 'lodash/difference';

export const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  IMPORT_STATE: 'IMPORT_STATE'
};

/**
 * Action creators to change the History state.
 */
export const ActionCreators = {
  performAction(action) {
    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }
    return { type: ActionTypes.PERFORM_ACTION, action, timestamp: Date.now() };
  },

  reset() {
    return { type: ActionTypes.RESET, timestamp: Date.now() };
  },

  rollback() {
    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
  },

  commit() {
    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
  },

  sweep() {
    return { type: ActionTypes.SWEEP };
  },

  toggleAction(id) {
    return { type: ActionTypes.TOGGLE_ACTION, id };
  },

  jumpToState(index) {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  },

  importState(nextLiftedState) {
    return { type: ActionTypes.IMPORT_STATE, nextLiftedState };
  }
};

const INIT_ACTION = { type: '@@INIT' };

/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(reducer, action, state, error) {
  if (error) {
    return {
      state,
      error: 'Interrupted by an error up the chain'
    };
  }

  let nextState = state;
  let nextError;
  try {
    nextState = reducer(state, action);
  } catch (err) {
    nextError = err.toString();
    if (typeof window === 'object' && typeof window.chrome !== 'undefined') {
      // In Chrome, rethrowing provides better source map support
      setTimeout(() => { throw err; });
    } else {
      console.error(err);
    }
  }

  return {
    state: nextState,
    error: nextError
  };
}

/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 */
function recomputeStates(
  computedStates,
  minInvalidatedStateIndex,
  reducer,
  committedState,
  actionsById,
  stagedActionIds,
  skippedActionIds
) {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (
    minInvalidatedStateIndex >= computedStates.length &&
    computedStates.length === stagedActionIds.length
  ) {
    return computedStates;
  }

  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  for (let i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;
    const previousError = previousEntry ? previousEntry.error : undefined;

    const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
    const entry = shouldSkip ?
      previousEntry :
      computeNextEntry(reducer, action, previousState, previousError);

    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}

/**
 * Lifts an app's action into an action on the lifted store.
 */
function liftAction(action) {
  return ActionCreators.performAction(action);
}

/**
 * Creates a history state reducer from an app's reducer.
 */
function liftReducerWith(reducer, initialCommittedState, monitorReducer) {
  const initialLiftedState = {
    monitorState: monitorReducer(undefined, {}),
    nextActionId: 1,
    actionsById: { 0: liftAction(INIT_ACTION) },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: initialCommittedState,
    currentStateIndex: 0,
    computedStates: []
  };

  /**
   * Manages how the history actions modify the history state.
   */
  return (liftedState = initialLiftedState, liftedAction) => {
    let {
      monitorState,
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates
    } = liftedState;

    // By default, agressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    switch (liftedAction.type) {
      case ActionTypes.RESET: {
        // Get back to the state the store was created with.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = initialCommittedState;
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case ActionTypes.COMMIT: {
        // Consider the last committed state the new starting point.
        // Squash any staged actions into a single committed state.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case ActionTypes.ROLLBACK: {
        // Forget about any staged actions.
        // Start again from the last committed state.
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case ActionTypes.TOGGLE_ACTION: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { id: actionId } = liftedAction;
        const index = skippedActionIds.indexOf(actionId);
        if (index === -1) {
          skippedActionIds = [actionId, ...skippedActionIds];
        } else {
          skippedActionIds = skippedActionIds.filter(id => id !== actionId);
        }
        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
        break;
      }
      case ActionTypes.JUMP_TO_STATE: {
        // Without recomputing anything, move the pointer that tell us
        // which state is considered the current one. Useful for sliders.
        currentStateIndex = liftedAction.index;
        // Optimization: we know the history has not changed.
        minInvalidatedStateIndex = Infinity;
        break;
      }
      case ActionTypes.SWEEP: {
        // Forget any actions that are currently being skipped.
        stagedActionIds = difference(stagedActionIds, skippedActionIds);
        skippedActionIds = [];
        currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
        break;
      }
      case ActionTypes.PERFORM_ACTION: {
        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex++;
        }
        const actionId = nextActionId++;
        // Mutation! This is the hottest path, and we optimize on purpose.
        // It is safe because we set a new key in a cache dictionary.
        actionsById[actionId] = liftedAction;
        stagedActionIds = [...stagedActionIds, actionId];
        // Optimization: we know that only the new action needs computing.
        minInvalidatedStateIndex = stagedActionIds.length - 1;
        break;
      }
      case ActionTypes.IMPORT_STATE: {
        // Completely replace everything.
        ({
          monitorState,
          actionsById,
          nextActionId,
          stagedActionIds,
          skippedActionIds,
          committedState,
          currentStateIndex,
          computedStates
        } = liftedAction.nextLiftedState);
        break;
      }
      case '@@redux/INIT': {
        // Always recompute states on hot reload and init.
        minInvalidatedStateIndex = 0;
        break;
      }
      default: {
        // If the action is not recognized, it's a monitor action.
        // Optimization: a monitor action can't change history.
        minInvalidatedStateIndex = Infinity;
        break;
      }
    }

    computedStates = recomputeStates(
      computedStates,
      minInvalidatedStateIndex,
      reducer,
      committedState,
      actionsById,
      stagedActionIds,
      skippedActionIds
    );
    monitorState = monitorReducer(monitorState, liftedAction);
    return {
      monitorState,
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates
    };
  };
}

/**
 * Provides an app's view into the state of the lifted store.
 */
function unliftState(liftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];
  return state;
}

/**
 * Provides an app's view into the lifted store.
 */
function unliftStore(liftedStore, liftReducer) {
  let lastDefinedState;

  return {
    ...liftedStore,

    liftedStore,

    dispatch(action) {
      liftedStore.dispatch(liftAction(action));
      return action;
    },

    getState() {
      const state = unliftState(liftedStore.getState());
      if (state !== undefined) {
        lastDefinedState = state;
      }
      return lastDefinedState;
    },

    replaceReducer(nextReducer) {
      liftedStore.replaceReducer(liftReducer(nextReducer));
    }
  };
}

/**
 * Redux instrumentation store enhancer.
 */
export default function instrument(monitorReducer = () => null) {
  return createStore => (reducer, initialState, enhancer) => {

    function liftReducer(r) {
      if (typeof r !== 'function') {
        if (r && typeof r.default === 'function') {
          throw new Error(
            'Expected the reducer to be a function. ' +
            'Instead got an object with a "default" field. ' +
            'Did you pass a module instead of the default export? ' +
            'Try passing require(...).default instead.'
          );
        }
        throw new Error('Expected the reducer to be a function.');
      }
      return liftReducerWith(r, initialState, monitorReducer);
    }

    const liftedStore = createStore(liftReducer(reducer), enhancer);
    if (liftedStore.liftedStore) {
      throw new Error(
        'DevTools instrumentation should not be applied more than once. ' +
        'Check your store configuration.'
      );
    }

    return unliftStore(liftedStore, liftReducer);
  };
}
