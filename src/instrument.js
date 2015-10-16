export const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  JUMP_TO_STATE: 'JUMP_TO_STATE'
};

/**
 * Action creators to change the History state.
 */
export const ActionCreators = {
  performAction(action) {
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

  toggleAction(index) {
    return { type: ActionTypes.TOGGLE_ACTION, index };
  },

  jumpToState(index) {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  }
};

const INIT_ACTION = { type: '@@INIT' };

function toggle(obj, key) {
  const clone = { ...obj };
  if (clone[key]) {
    delete clone[key];
  } else {
    clone[key] = true;
  }
  return clone;
}

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
    console.error(err.stack || err);
  }

  return {
    state: nextState,
    error: nextError
  };
}

/**
 * Runs the reducer on all actions to get a fresh computation log.
 */
function recomputeStates(reducer, committedState, stagedActions, skippedActions) {
  const computedStates = [];

  for (let i = 0; i < stagedActions.length; i++) {
    const action = stagedActions[i];

    const previousEntry = computedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;
    const previousError = previousEntry ? previousEntry.error : undefined;

    const shouldSkip = Boolean(skippedActions[i]);
    const entry = shouldSkip ?
      previousEntry :
      computeNextEntry(reducer, action, previousState, previousError);

    computedStates.push(entry);
  }

  return computedStates;
}

/**
 * Creates a history state reducer from an app's reducer.
 */
function liftReducerWith(reducer, initialCommittedState, monitorReducer) {
  const initialLiftedState = {
    committedState: initialCommittedState,
    stagedActions: [INIT_ACTION],
    skippedActions: {},
    currentStateIndex: 0,
    timestamps: [Date.now()],
    monitorState: monitorReducer(undefined, {})
  };

  /**
   * Manages how the history actions modify the history state.
   */
  return (liftedState = initialLiftedState, liftedAction) => {
    let shouldRecomputeStates = true;
    let {
      monitorState,
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      timestamps
    } = liftedState;

    switch (liftedAction.type) {
    case ActionTypes.RESET:
      committedState = initialCommittedState;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [liftedAction.timestamp];
      break;
    case ActionTypes.COMMIT:
      committedState = computedStates[currentStateIndex].state;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [liftedAction.timestamp];
      break;
    case ActionTypes.ROLLBACK:
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [liftedAction.timestamp];
      break;
    case ActionTypes.TOGGLE_ACTION:
      skippedActions = toggle(skippedActions, liftedAction.index);
      break;
    case ActionTypes.JUMP_TO_STATE:
      currentStateIndex = liftedAction.index;
      // Optimization: we know the history has not changed.
      shouldRecomputeStates = false;
      break;
    case ActionTypes.SWEEP:
      stagedActions = stagedActions.filter((_, i) => !skippedActions[i]);
      timestamps = timestamps.filter((_, i) => !skippedActions[i]);
      skippedActions = {};
      currentStateIndex = Math.min(currentStateIndex, stagedActions.length - 1);
      break;
    case ActionTypes.PERFORM_ACTION:
      if (currentStateIndex === stagedActions.length - 1) {
        currentStateIndex++;
      }

      stagedActions = [...stagedActions, liftedAction.action];
      timestamps = [...timestamps, liftedAction.timestamp];

      // Optimization: we know that the past has not changed.
      shouldRecomputeStates = false;
      // Instead of recomputing the states, append the next one.
      const previousEntry = computedStates[computedStates.length - 1];
      const nextEntry = computeNextEntry(
        reducer,
        liftedAction.action,
        previousEntry.state,
        previousEntry.error
      );
      computedStates = [...computedStates, nextEntry];
      break;
    case '@@redux/INIT':
      // Always recompute states on hot reload and init.
      shouldRecomputeStates = true;
      break;
    default:
      // Optimization: a monitor action can't change history.
      shouldRecomputeStates = false;
      break;
    }

    if (shouldRecomputeStates) {
      computedStates = recomputeStates(
        reducer,
        committedState,
        stagedActions,
        skippedActions
      );
    }

    monitorState = monitorReducer(monitorState, liftedAction);

    return {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      timestamps,
      monitorState
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
 * Lifts an app's action into an action on the lifted store.
 */
function liftAction(action) {
  return ActionCreators.performAction(action);
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
 * Redux History store enhancer.
 */
export default function instrument(monitorReducer = () => null) {
  return createStore => (reducer, initialState) => {
    function liftReducer(r) {
      return liftReducerWith(r, initialState, monitorReducer);
    }

    const liftedStore = createStore(liftReducer(reducer));
    return unliftStore(liftedStore, liftReducer);
  };
}
