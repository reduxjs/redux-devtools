const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  SET_MONITOR_STATE: 'SET_MONITOR_STATE',
  RECOMPUTE_STATES: 'RECOMPUTE_STATES'
};

const INIT_ACTION = {
  type: '@@INIT'
};

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
 * It's probably a good idea to do this only if the code has changed,
 * but until we have some tests we'll just do it every time an action fires.
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
 * Lifts the app state reducer into a DevTools state reducer.
 */
function liftReducer(reducer, initialState) {
  const initialLiftedState = {
    committedState: initialState,
    stagedActions: [INIT_ACTION],
    skippedActions: {},
    currentStateIndex: 0,
    monitorState: {
      isVisible: true
    }
  };

  /**
   * Manages how the DevTools actions modify the DevTools state.
   */
  return function liftedReducer(liftedState = initialLiftedState, liftedAction) {
    let {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      monitorState
    } = liftedState;

    switch (liftedAction.type) {
    case ActionTypes.RESET:
      committedState = initialState;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      break;
    case ActionTypes.COMMIT:
      committedState = computedStates[currentStateIndex].state;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      break;
    case ActionTypes.ROLLBACK:
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      break;
    case ActionTypes.TOGGLE_ACTION:
      skippedActions = toggle(skippedActions, liftedAction.index);
      break;
    case ActionTypes.JUMP_TO_STATE:
      currentStateIndex = liftedAction.index;
      break;
    case ActionTypes.SWEEP:
      stagedActions = stagedActions.filter((_, i) => !skippedActions[i]);
      skippedActions = {};
      currentStateIndex = Math.min(currentStateIndex, stagedActions.length - 1);
      break;
    case ActionTypes.PERFORM_ACTION:
      if (currentStateIndex === stagedActions.length - 1) {
        currentStateIndex++;
      }
      stagedActions = [...stagedActions, liftedAction.action];
      break;
    case ActionTypes.SET_MONITOR_STATE:
      monitorState = liftedAction.monitorState;
      break;
    case ActionTypes.RECOMPUTE_STATES:
      stagedActions = liftedAction.stagedActions;
      committedState = liftedAction.committedState;
      currentStateIndex = stagedActions.length - 1;
      skippedActions = {};
      break;
    default:
      break;
    }

    computedStates = recomputeStates(
      reducer,
      committedState,
      stagedActions,
      skippedActions
    );

    return {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      monitorState
    };
  };
}

/**
 * Lifts an app action to a DevTools action.
 */
function liftAction(action) {
  const liftedAction = { type: ActionTypes.PERFORM_ACTION, action };
  return liftedAction;
}

/**
 * Unlifts the DevTools state to the app state.
 */
function unliftState(liftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];
  return state;
}

/**
 * Unlifts the DevTools store to act like the app's store.
 */
function unliftStore(liftedStore, reducer) {
  return {
    ...liftedStore,
    devToolsStore: liftedStore,
    dispatch(action) {
      liftedStore.dispatch(liftAction(action));
      return action;
    },
    getState() {
      return unliftState(liftedStore.getState());
    },
    getReducer() {
      return reducer;
    },
    replaceReducer(nextReducer) {
      liftedStore.replaceReducer(liftReducer(nextReducer));
    }
  };
}

/**
 * Action creators to change the DevTools state.
 */
export const ActionCreators = {
  reset() {
    return { type: ActionTypes.RESET };
  },
  rollback() {
    return { type: ActionTypes.ROLLBACK };
  },
  commit() {
    return { type: ActionTypes.COMMIT };
  },
  sweep() {
    return { type: ActionTypes.SWEEP };
  },
  toggleAction(index) {
    return { type: ActionTypes.TOGGLE_ACTION, index };
  },
  jumpToState(index) {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  },
  setMonitorState(monitorState) {
    return { type: ActionTypes.SET_MONITOR_STATE, monitorState };
  },
  recomputeStates(committedState, stagedActions) {
    return {
      type: ActionTypes.RECOMPUTE_STATES,
      committedState,
      stagedActions
    };
  }
};

/**
 * Redux DevTools middleware.
 */
export default function devTools() {
  return next => (reducer, initialState) => {
    const liftedReducer = liftReducer(reducer, initialState);
    const liftedStore = next(liftedReducer);
    const store = unliftStore(liftedStore, reducer);
    return store;
  };
}
