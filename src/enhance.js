import { combineReducers, compose } from 'redux';

const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  JUMP_TO_STATE: 'JUMP_TO_STATE'
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
function createDevToolsStateReducer(reducer, initialCommittedState) {
  const initialState = {
    committedState: initialCommittedState,
    stagedActions: [INIT_ACTION],
    skippedActions: {},
    currentStateIndex: 0,
    timestamps: [Date.now()]
  };

  /**
   * Manages how the DevTools actions modify the DevTools state.
   */
  return function devToolsState(state = initialState, action) {
    let shouldRecomputeStates = true;
    let {
      committedState,
      stagedActions,
      skippedActions,
      computedStates,
      currentStateIndex,
      timestamps
    } = state;

    switch (action.type) {
    case ActionTypes.RESET:
      committedState = initialState;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [action.timestamp];
      break;
    case ActionTypes.COMMIT:
      committedState = computedStates[currentStateIndex].state;
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [action.timestamp];
      break;
    case ActionTypes.ROLLBACK:
      stagedActions = [INIT_ACTION];
      skippedActions = {};
      currentStateIndex = 0;
      timestamps = [action.timestamp];
      break;
    case ActionTypes.TOGGLE_ACTION:
      skippedActions = toggle(skippedActions, action.index);
      break;
    case ActionTypes.JUMP_TO_STATE:
      currentStateIndex = action.index;
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

      stagedActions = [...stagedActions, action.action];
      timestamps = [...timestamps, action.timestamp];

      // Optimization: we know that the past has not changed.
      shouldRecomputeStates = false;
      // Instead of recomputing the states, append the next one.
      const previousEntry = computedStates[computedStates.length - 1];
      const nextEntry = computeNextEntry(
        reducer,
        action.action,
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
 * Lifts an app action to a DevTools action.
 */
function liftAction(action) {
  const liftedAction = {
    type: ActionTypes.PERFORM_ACTION,
    action,
    timestamp: Date.now()
  };
  return liftedAction;
}

/**
 * Unlifts the DevTools state to the app state.
 */
function unliftState(liftedState) {
  const { computedStates, currentStateIndex } = liftedState.devToolsState;
  const { state } = computedStates[currentStateIndex];
  return state;
}

/**
 * Unlifts the DevTools store to act like the app's store.
 */
function mapToComputedStateStore(devToolsStore, wrapReducer) {
  let lastDefinedState;

  return {
    ...devToolsStore,

    devToolsStore,

    dispatch(action) {
      devToolsStore.dispatch(liftAction(action));
      return action;
    },

    getState() {
      const state = unliftState(devToolsStore.getState());
      if (state !== undefined) {
        lastDefinedState = state;
      }
      return lastDefinedState;
    },

    replaceReducer(nextReducer) {
      devToolsStore.replaceReducer(wrapReducer(nextReducer));
    }
  };
}

/**
 * Action creators to change the DevTools state.
 */
export const ActionCreators = {
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

/**
 * Redux DevTools store enhancer.
 */
export default function enhance(monitorReducer = () => null) {
  return next => (reducer, initialState) => {
    const wrapReducer = (r) => combineReducers({
      devToolsState: createDevToolsStateReducer(r, initialState),
      monitorState: monitorReducer
    });

    const devToolsStore = next(wrapReducer(reducer));
    return mapToComputedStateStore(devToolsStore, wrapReducer);
  };
}
