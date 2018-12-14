import difference from 'lodash/difference';
import union from 'lodash/union';
import isPlainObject from 'lodash/isPlainObject';
import $$observable from 'symbol-observable';

export const ActionTypes = {
  PERFORM_ACTION: 'PERFORM_ACTION',
  RESET: 'RESET',
  ROLLBACK: 'ROLLBACK',
  COMMIT: 'COMMIT',
  SWEEP: 'SWEEP',
  TOGGLE_ACTION: 'TOGGLE_ACTION',
  SET_ACTIONS_ACTIVE: 'SET_ACTIONS_ACTIVE',
  JUMP_TO_STATE: 'JUMP_TO_STATE',
  JUMP_TO_ACTION: 'JUMP_TO_ACTION',
  REORDER_ACTION: 'REORDER_ACTION',
  IMPORT_STATE: 'IMPORT_STATE',
  LOCK_CHANGES: 'LOCK_CHANGES',
  PAUSE_RECORDING: 'PAUSE_RECORDING'
};

/**
 * Action creators to change the History state.
 */
export const ActionCreators = {
  performAction(action, trace, traceLimit, toExcludeFromTrace) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      );
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      );
    }

    let stack;
    if (trace) {
      let extraFrames = 0;
      if (typeof trace === 'function') {
        stack = trace(action);
      } else {
        const error = Error();
        let prevStackTraceLimit;
        if (Error.captureStackTrace) {
          if (Error.stackTraceLimit < traceLimit) {
            prevStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = traceLimit;
          }
          Error.captureStackTrace(error, toExcludeFromTrace);
        } else {
          extraFrames = 3;
        }
        stack = error.stack;
        if (prevStackTraceLimit) Error.stackTraceLimit = prevStackTraceLimit;
        if (extraFrames || typeof Error.stackTraceLimit !== 'number' || Error.stackTraceLimit > traceLimit) {
          const frames = stack.split('\n');
          if (frames.length > traceLimit) {
            stack = frames.slice(0, traceLimit + extraFrames + (frames[0] === 'Error' ? 1 : 0)).join('\n');
          }
        }
      }
    }

    return { type: ActionTypes.PERFORM_ACTION, action, timestamp: Date.now(), stack };
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

  setActionsActive(start, end, active=true) {
    return { type: ActionTypes.SET_ACTIONS_ACTIVE, start, end, active };
  },

  reorderAction(actionId, beforeActionId) {
    return { type: ActionTypes.REORDER_ACTION, actionId, beforeActionId };
  },

  jumpToState(index) {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  },

  jumpToAction(actionId) {
    return { type: ActionTypes.JUMP_TO_ACTION, actionId };
  },

  importState(nextLiftedState, noRecompute) {
    return { type: ActionTypes.IMPORT_STATE, nextLiftedState, noRecompute };
  },

  lockChanges(status) {
    return { type: ActionTypes.LOCK_CHANGES, status };
  },

  pauseRecording(status) {
    return { type: ActionTypes.PAUSE_RECORDING, status };
  }
};

export const INIT_ACTION = { type: '@@INIT' };

/**
 * Computes the next entry with exceptions catching.
 */
function computeWithTryCatch(reducer, action, state) {
  let nextState = state;
  let nextError;
  try {
    nextState = reducer(state, action);
  } catch (err) {
    nextError = err.toString();
    if (
      typeof window === 'object' && (
        typeof window.chrome !== 'undefined' ||
        typeof window.process !== 'undefined' &&
        window.process.type === 'renderer'
      )) {
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
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry(reducer, action, state, shouldCatchErrors) {
  if (!shouldCatchErrors) {
    return { state: reducer(state, action) };
  }
  return computeWithTryCatch(reducer, action, state);
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
  skippedActionIds,
  shouldCatchErrors
) {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (
    !computedStates || minInvalidatedStateIndex === -1 ||
    (minInvalidatedStateIndex >= computedStates.length &&
    computedStates.length === stagedActionIds.length)
  ) {
    return computedStates;
  }

  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  for (let i = minInvalidatedStateIndex; i < stagedActionIds.length; i++) {
    const actionId = stagedActionIds[i];
    const action = actionsById[actionId].action;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;

    const shouldSkip = skippedActionIds.indexOf(actionId) > -1;
    let entry;
    if (shouldSkip) {
      entry = previousEntry;
    } else {
      if (shouldCatchErrors && previousEntry && previousEntry.error) {
        entry = {
          state: previousState,
          error: 'Interrupted by an error up the chain'
        };
      } else {
        entry = computeNextEntry(reducer, action, previousState, shouldCatchErrors);
      }
    }
    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}

/**
 * Lifts an app's action into an action on the lifted store.
 */
export function liftAction(action, trace, traceLimit, toExcludeFromTrace) {
  return ActionCreators.performAction(action, trace, traceLimit, toExcludeFromTrace);
}

/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith(reducer, initialCommittedState, monitorReducer, options) {
  const initialLiftedState = {
    monitorState: monitorReducer(undefined, {}),
    nextActionId: 1,
    actionsById: { 0: liftAction(INIT_ACTION) },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: initialCommittedState,
    currentStateIndex: 0,
    computedStates: [],
    isLocked: options.shouldStartLocked === true,
    isPaused: options.shouldRecordChanges === false
  };

  /**
   * Manages how the history actions modify the history state.
   */
  return (liftedState, liftedAction) => {
    let {
      monitorState,
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates,
      isLocked,
      isPaused
    } = liftedState || initialLiftedState;

    if (!liftedState) {
      // Prevent mutating initialLiftedState
      actionsById = { ...actionsById };
    }

    function commitExcessActions(n) {
      // Auto-commits n-number of excess actions.
      let excess = n;
      let idsToDelete = stagedActionIds.slice(1, excess + 1);

      for (let i = 0; i < idsToDelete.length; i++) {
        if (computedStates[i + 1].error) {
          // Stop if error is found. Commit actions up to error.
          excess = i;
          idsToDelete = stagedActionIds.slice(1, excess + 1);
          break;
        } else {
          delete actionsById[idsToDelete[i]];
        }
      }

      skippedActionIds = skippedActionIds.filter(id => idsToDelete.indexOf(id) === -1);
      stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
      committedState = computedStates[excess].state;
      computedStates = computedStates.slice(excess);
      currentStateIndex = currentStateIndex > excess
        ? currentStateIndex - excess
        : 0;
    }

    function computePausedAction(shouldInit) {
      let computedState;
      if (shouldInit) {
        computedState = computedStates[currentStateIndex];
        monitorState = monitorReducer(monitorState, liftedAction);
      } else {
        computedState = computeNextEntry(
          reducer, liftedAction.action, computedStates[currentStateIndex].state, false
        );
      }
      if (!options.pauseActionType || nextActionId === 1) {
        return {
          monitorState,
          actionsById: { 0: liftAction(INIT_ACTION) },
          nextActionId: 1,
          stagedActionIds: [0],
          skippedActionIds: [],
          committedState: computedState.state,
          currentStateIndex: 0,
          computedStates: [computedState],
          isLocked,
          isPaused: true
        };
      }
      if (shouldInit) {
        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex++;
        }
        stagedActionIds = [...stagedActionIds, nextActionId];
        nextActionId++;
      }
      return {
        monitorState,
        actionsById: {
          ...actionsById,
          [nextActionId - 1]: liftAction({ type: options.pauseActionType })
        },
        nextActionId,
        stagedActionIds,
        skippedActionIds,
        committedState,
        currentStateIndex,
        computedStates: [...computedStates.slice(0, stagedActionIds.length - 1), computedState],
        isLocked,
        isPaused: true
      };
    }

    // By default, agressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    // maxAge number can be changed dynamically
    let maxAge = options.maxAge;
    if (typeof maxAge === 'function') maxAge = maxAge(liftedAction, liftedState);

    if (/^@@redux\/(INIT|REPLACE)/.test(liftedAction.type)) {
      if (options.shouldHotReload === false) {
        actionsById = { 0: liftAction(INIT_ACTION) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState = computedStates.length === 0 ? initialCommittedState :
            computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
      }

      // Recompute states on hot reload and init.
      minInvalidatedStateIndex = 0;

      if (maxAge && stagedActionIds.length > maxAge) {
        // States must be recomputed before committing excess.
        computedStates = recomputeStates(
          computedStates,
          minInvalidatedStateIndex,
          reducer,
          committedState,
          actionsById,
          stagedActionIds,
          skippedActionIds,
          options.shouldCatchErrors
        );

        commitExcessActions(stagedActionIds.length - maxAge);

        // Avoid double computation.
        minInvalidatedStateIndex = Infinity;
      }
    } else {
      switch (liftedAction.type) {
        case ActionTypes.PERFORM_ACTION: {
          if (isLocked) return liftedState || initialLiftedState;
          if (isPaused) return computePausedAction();

          // Auto-commit as new actions come in.
          if (maxAge && stagedActionIds.length >= maxAge) {
            commitExcessActions(stagedActionIds.length - maxAge + 1);
          }

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
        case ActionTypes.SET_ACTIONS_ACTIVE: {
          // Toggle whether an action with given ID is skipped.
          // Being skipped means it is a no-op during the computation.
          const { start, end, active } = liftedAction;
          const actionIds = [];
          for (let i = start; i < end; i++) actionIds.push(i);
          if (active) {
            skippedActionIds = difference(skippedActionIds, actionIds);
          } else {
            skippedActionIds = union(skippedActionIds, actionIds);
          }

          // Optimization: we know history before this action hasn't changed
          minInvalidatedStateIndex = stagedActionIds.indexOf(start);
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
        case ActionTypes.JUMP_TO_ACTION: {
          // Jumps to a corresponding state to a specific action.
          // Useful when filtering actions.
          const index = stagedActionIds.indexOf(liftedAction.actionId);
          if (index !== -1) currentStateIndex = index;
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
        case ActionTypes.REORDER_ACTION: {
          // Recompute actions in a new order.
          const actionId = liftedAction.actionId;
          const idx = stagedActionIds.indexOf(actionId);
          // do nothing in case the action is already removed or trying to move the first action
          if (idx < 1) break;
          const beforeActionId = liftedAction.beforeActionId;
          let newIdx = stagedActionIds.indexOf(beforeActionId);
          if (newIdx < 1) { // move to the beginning or to the end
            const count = stagedActionIds.length;
            newIdx = beforeActionId > stagedActionIds[count - 1] ? count : 1;
          }
          const diff = idx - newIdx;

          if (diff > 0) { // move left
            stagedActionIds = [
              ...stagedActionIds.slice(0, newIdx),
              actionId,
              ...stagedActionIds.slice(newIdx, idx),
              ...stagedActionIds.slice(idx + 1)
            ];
            minInvalidatedStateIndex = newIdx;
          } else if (diff < 0) { // move right
            stagedActionIds = [
              ...stagedActionIds.slice(0, idx),
              ...stagedActionIds.slice(idx + 1, newIdx),
              actionId,
              ...stagedActionIds.slice(newIdx)
            ];
            minInvalidatedStateIndex = idx;
          }
          break;
        }
        case ActionTypes.IMPORT_STATE: {
          if (Array.isArray(liftedAction.nextLiftedState)) {
            // recompute array of actions
            actionsById = { 0: liftAction(INIT_ACTION) };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            currentStateIndex = liftedAction.nextLiftedState.length;
            computedStates = [];
            committedState = liftedAction.preloadedState;
            minInvalidatedStateIndex = 0;
            // iterate through actions
            liftedAction.nextLiftedState.forEach(action => {
              actionsById[nextActionId] = liftAction(action, options.trace || options.shouldIncludeCallstack);
              stagedActionIds.push(nextActionId);
              nextActionId++;
            });
          } else {
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

            if (liftedAction.noRecompute) {
              minInvalidatedStateIndex = Infinity;
            }
          }

          break;
        }
        case ActionTypes.LOCK_CHANGES: {
          isLocked = liftedAction.status;
          minInvalidatedStateIndex = Infinity;
          break;
        }
        case ActionTypes.PAUSE_RECORDING: {
          isPaused = liftedAction.status;
          if (isPaused) {
            return computePausedAction(true);
          }
          // Commit when unpausing
          actionsById = { 0: liftAction(INIT_ACTION) };
          nextActionId = 1;
          stagedActionIds = [0];
          skippedActionIds = [];
          committedState = computedStates[currentStateIndex].state;
          currentStateIndex = 0;
          computedStates = [];
          break;
        }
        default: {
          // If the action is not recognized, it's a monitor action.
          // Optimization: a monitor action can't change history.
          minInvalidatedStateIndex = Infinity;
          break;
        }
      }
    }

    computedStates = recomputeStates(
      computedStates,
      minInvalidatedStateIndex,
      reducer,
      committedState,
      actionsById,
      stagedActionIds,
      skippedActionIds,
      options.shouldCatchErrors
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
      computedStates,
      isLocked,
      isPaused
    };
  };
}

/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState(liftedState) {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];
  return state;
}

/**
 * Provides an app's view into the lifted store.
 */
export function unliftStore(liftedStore, liftReducer, options) {
  let lastDefinedState;
  const trace = options.trace || options.shouldIncludeCallstack;
  const traceLimit = options.traceLimit || 10;

  function getState() {
    const state = unliftState(liftedStore.getState());
    if (state !== undefined) {
      lastDefinedState = state;
    }
    return lastDefinedState;
  }

  function dispatch(action) {
    liftedStore.dispatch(liftAction(action, trace, traceLimit, dispatch));
    return action;
  }

  return {
    ...liftedStore,

    liftedStore,

    dispatch,

    getState,

    replaceReducer(nextReducer) {
      liftedStore.replaceReducer(liftReducer(nextReducer));
    },

    [$$observable]() {
      return {
        ...liftedStore[$$observable](),
        subscribe(observer) {
          if (typeof observer !== 'object') {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          const unsubscribe = liftedStore.subscribe(observeState);
          return { unsubscribe };
        }
      };
    }
  };
}

/**
 * Redux instrumentation store enhancer.
 */
export default function instrument(monitorReducer = () => null, options = {}) {
  if (typeof options.maxAge === 'number' && options.maxAge < 2) {
    throw new Error(
      'DevTools.instrument({ maxAge }) option, if specified, ' +
      'may not be less than 2.'
    );
  }

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
      return liftReducerWith(r, initialState, monitorReducer, options);
    }

    const liftedStore = createStore(liftReducer(reducer), enhancer);
    if (liftedStore.liftedStore) {
      throw new Error(
        'DevTools instrumentation should not be applied more than once. ' +
        'Check your store configuration.'
      );
    }

    return unliftStore(liftedStore, liftReducer, options);
  };
}
