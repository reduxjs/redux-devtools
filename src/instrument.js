import { combineReducers } from 'redux';

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
function createHistoryReducer(reducer, initialCommittedState) {
  const initialHistoryState = {
    committedState: initialCommittedState,
    stagedActions: [INIT_ACTION],
    skippedActions: {},
    currentStateIndex: 0,
    timestamps: [Date.now()]
  };

  /**
   * Manages how the history actions modify the history state.
   */
  return (historyState = initialHistoryState, historyAction) => {
    let shouldRecomputeStates = true;
    let {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      timestamps
    } = historyState;

    switch (historyAction.type) {
    case ActionTypes.RESET:
      committedState = initialCommittedState;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [historyAction.timestamp];
      break;
    case ActionTypes.COMMIT:
      committedState = computedStates[currentStateIndex].state;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [historyAction.timestamp];
      break;
    case ActionTypes.ROLLBACK:
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [historyAction.timestamp];
      break;
    case ActionTypes.TOGGLE_ACTION:
      skippedActions = toggle(skippedActions, historyAction.index);
      break;
    case ActionTypes.JUMP_TO_STATE:
      currentStateIndex = historyAction.index;
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

      stagedActions = [...stagedActions, historyAction.action];
      timestamps = [...timestamps, historyAction.timestamp];

      // Optimization: we know that the past has not changed.
      shouldRecomputeStates = false;
      // Instead of recomputing the states, append the next one.
      const previousEntry = computedStates[computedStates.length - 1];
      const nextEntry = computeNextEntry(
        reducer,
        historyAction.action,
        previousEntry.state,
        previousEntry.error
      );
      computedStates = [...computedStates, nextEntry];
      break;
    default:
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

    return {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      timestamps
    };
  };
}

/**
 * Provides a view into the History state that matches the current app state.
 */
function selectAppState(instrumentedState) {
  const { computedStates, currentStateIndex } = instrumentedState.historyState;
  const { state } = computedStates[currentStateIndex];
  return state;
}

/**
 * Deinstruments the History store to act like the app's store.
 */
function selectAppStore(instrumentedStore, instrumentReducer) {
  let lastDefinedState;

  return {
    ...instrumentedStore,

    instrumentedStore,

    dispatch(action) {
      instrumentedStore.dispatch(ActionCreators.performAction(action));
      return action;
    },

    getState() {
      const state = selectAppState(instrumentedStore.getState());
      if (state !== undefined) {
        lastDefinedState = state;
      }
      return lastDefinedState;
    },

    replaceReducer(nextReducer) {
      instrumentedStore.replaceReducer(instrumentReducer(nextReducer));
    }
  };
}

/**
 * Redux History store enhancer.
 */
export default function instrument(monitorReducer = () => null) {
  return createStore => (reducer, initialState) => {
    function instrumentReducer(r) {
      const historyReducer = createHistoryReducer(r, initialState);
      return ({ historyState, monitorState } = {}, action) => ({
        historyState: historyReducer(historyState, action),
        monitorState: monitorReducer(monitorState, action)
      });
    }

    const instrumentedStore = createStore(instrumentReducer(reducer));
    return selectAppStore(instrumentedStore, instrumentReducer);
  };
}
