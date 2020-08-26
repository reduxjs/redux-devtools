import difference from 'lodash/difference';
import union from 'lodash/union';
import isPlainObject from 'lodash/isPlainObject';
import $$observable from 'symbol-observable';
import {
  Action,
  Observable,
  PreloadedState,
  Reducer,
  Store,
  StoreEnhancer,
  StoreEnhancerStoreCreator,
} from 'redux';

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
  PAUSE_RECORDING: 'PAUSE_RECORDING',
} as const;

const isChrome =
  typeof window === 'object' &&
  (typeof (window as typeof window & { chrome: unknown }).chrome !==
    'undefined' ||
    (typeof window.process !== 'undefined' &&
      (window.process as typeof window.process & { type: unknown }).type ===
        'renderer'));

const isChromeOrNode =
  isChrome ||
  (typeof process !== 'undefined' &&
    process.release &&
    process.release.name === 'node');

export interface PerformAction<A extends Action<unknown>> {
  type: typeof ActionTypes.PERFORM_ACTION;
  action: A;
  timestamp: number;
  stack: string | undefined;
}

interface ResetAction {
  type: typeof ActionTypes.RESET;
  timestamp: number;
}

interface RollbackAction {
  type: typeof ActionTypes.ROLLBACK;
  timestamp: number;
}

interface CommitAction {
  type: typeof ActionTypes.COMMIT;
  timestamp: number;
}

interface SweepAction {
  type: typeof ActionTypes.SWEEP;
}

interface ToggleAction {
  type: typeof ActionTypes.TOGGLE_ACTION;
  id: number;
}

interface SetActionsActiveAction {
  type: typeof ActionTypes.SET_ACTIONS_ACTIVE;
  start: number;
  end: number;
  active: boolean;
}

interface ReorderAction {
  type: typeof ActionTypes.REORDER_ACTION;
  actionId: number;
  beforeActionId: number;
}

interface JumpToStateAction {
  type: typeof ActionTypes.JUMP_TO_STATE;
  index: number;
}

interface JumpToActionAction {
  type: typeof ActionTypes.JUMP_TO_ACTION;
  actionId: number;
}

interface ImportStateAction<S, A extends Action<unknown>, MonitorState> {
  type: typeof ActionTypes.IMPORT_STATE;
  nextLiftedState: LiftedState<S, A, MonitorState> | readonly A[];
  preloadedState?: S;
  noRecompute: boolean | undefined;
}

interface LockChangesAction {
  type: typeof ActionTypes.LOCK_CHANGES;
  status: boolean;
}

interface PauseRecordingAction {
  type: typeof ActionTypes.PAUSE_RECORDING;
  status: boolean;
}

export type LiftedAction<S, A extends Action<unknown>, MonitorState> =
  | PerformAction<A>
  | ResetAction
  | RollbackAction
  | CommitAction
  | SweepAction
  | ToggleAction
  | SetActionsActiveAction
  | ReorderAction
  | JumpToStateAction
  | JumpToActionAction
  | ImportStateAction<S, A, MonitorState>
  | LockChangesAction
  | PauseRecordingAction;

/**
 * Action creators to change the History state.
 */
export const ActionCreators = {
  performAction<A extends Action<unknown>>(
    action: A,
    trace?: ((action: A) => string | undefined) | boolean,
    traceLimit?: number,
    // eslint-disable-next-line @typescript-eslint/ban-types
    toExcludeFromTrace?: Function
  ) {
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
        if (Error.captureStackTrace && isChromeOrNode) {
          // avoid error-polyfill
          if (traceLimit && Error.stackTraceLimit < traceLimit) {
            prevStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = traceLimit;
          }
          Error.captureStackTrace(error, toExcludeFromTrace);
        } else {
          extraFrames = 3;
        }
        stack = error.stack;
        if (prevStackTraceLimit) Error.stackTraceLimit = prevStackTraceLimit;
        if (
          extraFrames ||
          typeof Error.stackTraceLimit !== 'number' ||
          (traceLimit && Error.stackTraceLimit > traceLimit)
        ) {
          if (stack != null) {
            const frames = stack.split('\n');
            if (traceLimit && frames.length > traceLimit) {
              stack = frames
                .slice(
                  0,
                  traceLimit +
                    extraFrames +
                    (frames[0].startsWith('Error') ? 1 : 0)
                )
                .join('\n');
            }
          }
        }
      }
    }

    return {
      type: ActionTypes.PERFORM_ACTION,
      action,
      timestamp: Date.now(),
      stack,
    };
  },

  reset(): ResetAction {
    return { type: ActionTypes.RESET, timestamp: Date.now() };
  },

  rollback(): RollbackAction {
    return { type: ActionTypes.ROLLBACK, timestamp: Date.now() };
  },

  commit(): CommitAction {
    return { type: ActionTypes.COMMIT, timestamp: Date.now() };
  },

  sweep(): SweepAction {
    return { type: ActionTypes.SWEEP };
  },

  toggleAction(id: number): ToggleAction {
    return { type: ActionTypes.TOGGLE_ACTION, id };
  },

  setActionsActive(
    start: number,
    end: number,
    active = true
  ): SetActionsActiveAction {
    return { type: ActionTypes.SET_ACTIONS_ACTIVE, start, end, active };
  },

  reorderAction(actionId: number, beforeActionId: number): ReorderAction {
    return { type: ActionTypes.REORDER_ACTION, actionId, beforeActionId };
  },

  jumpToState(index: number): JumpToStateAction {
    return { type: ActionTypes.JUMP_TO_STATE, index };
  },

  jumpToAction(actionId: number): JumpToActionAction {
    return { type: ActionTypes.JUMP_TO_ACTION, actionId };
  },

  importState<S, A extends Action<unknown>, MonitorState = null>(
    nextLiftedState: LiftedState<S, A, MonitorState> | readonly A[],
    noRecompute?: boolean
  ): ImportStateAction<S, A, MonitorState> {
    return { type: ActionTypes.IMPORT_STATE, nextLiftedState, noRecompute };
  },

  lockChanges(status: boolean): LockChangesAction {
    return { type: ActionTypes.LOCK_CHANGES, status };
  },

  pauseRecording(status: boolean): PauseRecordingAction {
    return { type: ActionTypes.PAUSE_RECORDING, status };
  },
};

export const INIT_ACTION = { type: '@@INIT' };

/**
 * Computes the next entry with exceptions catching.
 */
function computeWithTryCatch<S, A extends Action<unknown>>(
  reducer: Reducer<S, A>,
  action: A,
  state: S
) {
  let nextState = state;
  let nextError;
  try {
    nextState = reducer(state, action);
  } catch (err) {
    nextError = err.toString();
    if (isChrome) {
      // In Chrome, rethrowing provides better source map support
      setTimeout(() => {
        throw err;
      });
    } else {
      console.error(err); // eslint-disable-line no-console
    }
  }

  return {
    state: nextState,
    error: nextError,
  };
}

/**
 * Computes the next entry in the log by applying an action.
 */
function computeNextEntry<S, A extends Action<unknown>>(
  reducer: Reducer<S, A>,
  action: A,
  state: S,
  shouldCatchErrors: boolean | undefined
) {
  if (!shouldCatchErrors) {
    return { state: reducer(state, action) };
  }
  return computeWithTryCatch(reducer, action, state);
}

/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 */
function recomputeStates<S, A extends Action<unknown>>(
  computedStates: { state: S; error?: string }[],
  minInvalidatedStateIndex: number,
  reducer: Reducer<S, A>,
  committedState: S,
  actionsById: { [actionId: number]: PerformAction<A> },
  stagedActionIds: number[],
  skippedActionIds: number[],
  shouldCatchErrors: boolean | undefined
) {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (
    !computedStates ||
    minInvalidatedStateIndex === -1 ||
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
          error: 'Interrupted by an error up the chain',
        };
      } else {
        entry = computeNextEntry(
          reducer,
          action,
          previousState,
          shouldCatchErrors
        );
      }
    }
    nextComputedStates.push(entry);
  }

  return nextComputedStates;
}

/**
 * Lifts an app's action into an action on the lifted store.
 */
export function liftAction<A extends Action<unknown>>(
  action: A,
  trace?: ((action: A) => string | undefined) | boolean,
  traceLimit?: number,
  // eslint-disable-next-line @typescript-eslint/ban-types
  toExcludeFromTrace?: Function
) {
  return ActionCreators.performAction(
    action,
    trace,
    traceLimit,
    toExcludeFromTrace
  );
}

function isArray<S, A extends Action<unknown>, MonitorState>(
  nextLiftedState: LiftedState<S, A, MonitorState> | readonly A[]
): nextLiftedState is readonly A[] {
  return Array.isArray(nextLiftedState);
}

export interface LiftedState<S, A extends Action<unknown>, MonitorState> {
  monitorState: MonitorState;
  nextActionId: number;
  actionsById: { [actionId: number]: PerformAction<A> };
  stagedActionIds: number[];
  skippedActionIds: number[];
  committedState: S;
  currentStateIndex: number;
  computedStates: { state: S; error?: string }[];
  isLocked: boolean;
  isPaused: boolean;
}

/**
 * Creates a history state reducer from an app's reducer.
 */
export function liftReducerWith<
  S,
  A extends Action<unknown>,
  MonitorState,
  MonitorAction extends Action<unknown>
>(
  reducer: Reducer<S, A>,
  initialCommittedState: PreloadedState<S> | undefined,
  monitorReducer: Reducer<MonitorState, MonitorAction>,
  options: Options<S, A, MonitorState, MonitorAction>
): Reducer<LiftedState<S, A, MonitorState>, LiftedAction<S, A, MonitorState>> {
  const initialLiftedState: LiftedState<S, A, MonitorState> = {
    monitorState: monitorReducer(undefined, {} as MonitorAction),
    nextActionId: 1,
    actionsById: { 0: liftAction(INIT_ACTION as A) },
    stagedActionIds: [0],
    skippedActionIds: [],
    committedState: initialCommittedState as S,
    currentStateIndex: 0,
    computedStates: [],
    isLocked: options.shouldStartLocked === true,
    isPaused: options.shouldRecordChanges === false,
  };

  /**
   * Manages how the history actions modify the history state.
   */
  return (
    liftedState: LiftedState<S, A, MonitorState> | undefined,
    liftedAction: LiftedAction<S, A, MonitorState>
  ): LiftedState<S, A, MonitorState> => {
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
      isPaused,
    } = liftedState || initialLiftedState;

    if (!liftedState) {
      // Prevent mutating initialLiftedState
      actionsById = { ...actionsById };
    }

    function commitExcessActions(n: number) {
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

      skippedActionIds = skippedActionIds.filter(
        (id) => idsToDelete.indexOf(id) === -1
      );
      stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
      committedState = computedStates[excess].state;
      computedStates = computedStates.slice(excess);
      currentStateIndex =
        currentStateIndex > excess ? currentStateIndex - excess : 0;
    }

    function computePausedAction(
      shouldInit?: boolean
    ): LiftedState<S, A, MonitorState> {
      let computedState;
      if (shouldInit) {
        computedState = computedStates[currentStateIndex];
        monitorState = monitorReducer(
          monitorState,
          liftedAction as MonitorAction
        );
      } else {
        computedState = computeNextEntry(
          reducer,
          (liftedAction as PerformAction<A>).action,
          computedStates[currentStateIndex].state,
          false
        );
      }
      if (!options.pauseActionType || nextActionId === 1) {
        return {
          monitorState,
          actionsById: { 0: liftAction(INIT_ACTION as A) },
          nextActionId: 1,
          stagedActionIds: [0],
          skippedActionIds: [],
          committedState: computedState.state,
          currentStateIndex: 0,
          computedStates: [computedState],
          isLocked,
          isPaused: true,
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
          [nextActionId - 1]: liftAction({
            type: options.pauseActionType,
          } as A),
        },
        nextActionId,
        stagedActionIds,
        skippedActionIds,
        committedState,
        currentStateIndex,
        computedStates: [
          ...computedStates.slice(0, stagedActionIds.length - 1),
          computedState,
        ],
        isLocked,
        isPaused: true,
      };
    }

    // By default, aggressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    // maxAge number can be changed dynamically
    let maxAge = options.maxAge;
    if (typeof maxAge === 'function')
      maxAge = maxAge(liftedAction, liftedState);

    if (/^@@redux\/(INIT|REPLACE)/.test(liftedAction.type)) {
      if (options.shouldHotReload === false) {
        actionsById = { 0: liftAction(INIT_ACTION as A) };
        nextActionId = 1;
        stagedActionIds = [0];
        skippedActionIds = [];
        committedState =
          computedStates.length === 0
            ? (initialCommittedState as S)
            : computedStates[currentStateIndex].state;
        currentStateIndex = 0;
        computedStates = [];
      }

      // Recompute states on hot reload and init.
      minInvalidatedStateIndex = 0;

      if (maxAge && stagedActionIds.length > maxAge) {
        // States must be recomputed before committing excess.
        computedStates = recomputeStates<S, A>(
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
          actionsById = { 0: liftAction(INIT_ACTION as A) };
          nextActionId = 1;
          stagedActionIds = [0];
          skippedActionIds = [];
          committedState = initialCommittedState as S;
          currentStateIndex = 0;
          computedStates = [];
          break;
        }
        case ActionTypes.COMMIT: {
          // Consider the last committed state the new starting point.
          // Squash any staged actions into a single committed state.
          actionsById = { 0: liftAction(INIT_ACTION as A) };
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
          actionsById = { 0: liftAction(INIT_ACTION as A) };
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
            skippedActionIds = skippedActionIds.filter((id) => id !== actionId);
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
          currentStateIndex = Math.min(
            currentStateIndex,
            stagedActionIds.length - 1
          );
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
          if (newIdx < 1) {
            // move to the beginning or to the end
            const count = stagedActionIds.length;
            newIdx = beforeActionId > stagedActionIds[count - 1] ? count : 1;
          }
          const diff = idx - newIdx;

          if (diff > 0) {
            // move left
            stagedActionIds = [
              ...stagedActionIds.slice(0, newIdx),
              actionId,
              ...stagedActionIds.slice(newIdx, idx),
              ...stagedActionIds.slice(idx + 1),
            ];
            minInvalidatedStateIndex = newIdx;
          } else if (diff < 0) {
            // move right
            stagedActionIds = [
              ...stagedActionIds.slice(0, idx),
              ...stagedActionIds.slice(idx + 1, newIdx),
              actionId,
              ...stagedActionIds.slice(newIdx),
            ];
            minInvalidatedStateIndex = idx;
          }
          break;
        }
        case ActionTypes.IMPORT_STATE: {
          if (isArray(liftedAction.nextLiftedState)) {
            // recompute array of actions
            actionsById = { 0: liftAction(INIT_ACTION as A) };
            nextActionId = 1;
            stagedActionIds = [0];
            skippedActionIds = [];
            currentStateIndex = liftedAction.nextLiftedState.length;
            computedStates = [];
            committedState = liftedAction.preloadedState as S;
            minInvalidatedStateIndex = 0;
            // iterate through actions
            liftedAction.nextLiftedState.forEach((action) => {
              actionsById[nextActionId] = liftAction(
                action,
                options.trace || options.shouldIncludeCallstack
              );
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
              computedStates,
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
          actionsById = { 0: liftAction(INIT_ACTION as A) };
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
    monitorState = monitorReducer(monitorState, liftedAction as MonitorAction);
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
      isPaused,
    };
  };
}

/**
 * Provides an app's view into the state of the lifted store.
 */
export function unliftState<
  S,
  A extends Action<unknown>,
  MonitorState,
  NextStateExt
>(
  liftedState: LiftedState<S, A, MonitorState> & NextStateExt
): S & NextStateExt {
  const { computedStates, currentStateIndex } = liftedState;
  const { state } = computedStates[currentStateIndex];
  return state as S & NextStateExt;
}

export type LiftedReducer<S, A extends Action<unknown>, MonitorState> = Reducer<
  LiftedState<S, A, MonitorState>,
  LiftedAction<S, A, MonitorState>
>;

export type LiftedStore<S, A extends Action<unknown>, MonitorState> = Store<
  LiftedState<S, A, MonitorState>,
  LiftedAction<S, A, MonitorState>
>;

export type InstrumentExt<S, A extends Action<unknown>, MonitorState> = {
  liftedStore: LiftedStore<S, A, MonitorState>;
};

export type EnhancedStore<S, A extends Action<unknown>, MonitorState> = Store<
  S,
  A
> &
  InstrumentExt<S, A, MonitorState>;

/**
 * Provides an app's view into the lifted store.
 */
export function unliftStore<
  S,
  A extends Action<unknown>,
  MonitorState,
  MonitorAction extends Action<unknown>,
  NextExt,
  NextStateExt
>(
  liftedStore: Store<
    LiftedState<S, A, MonitorState> & NextStateExt,
    LiftedAction<S, A, MonitorState>
  > &
    NextExt,
  liftReducer: (r: Reducer<S, A>) => LiftedReducer<S, A, MonitorState>,
  options: Options<S, A, MonitorState, MonitorAction>
) {
  let lastDefinedState: S & NextStateExt;
  const trace = options.trace || options.shouldIncludeCallstack;
  const traceLimit = options.traceLimit || 10;

  function getState(): S & NextStateExt {
    const state = unliftState<S, A, MonitorState, NextStateExt>(
      liftedStore.getState()
    );
    if (state !== undefined) {
      lastDefinedState = state;
    }
    return lastDefinedState;
  }

  function dispatch<T extends A>(action: T): T {
    liftedStore.dispatch(liftAction<A>(action, trace, traceLimit, dispatch));
    return action;
  }

  return ({
    ...liftedStore,

    liftedStore,

    dispatch,

    getState,

    replaceReducer(nextReducer: Reducer<S & NextStateExt, A>) {
      liftedStore.replaceReducer(
        (liftReducer(
          (nextReducer as unknown) as Reducer<S, A>
        ) as unknown) as Reducer<
          LiftedState<S, A, MonitorState> & NextStateExt,
          LiftedAction<S, A, MonitorState>
        >
      );
    },

    [$$observable](): Observable<S> {
      return {
        ...(liftedStore as any)[$$observable](),
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
        },

        [$$observable]() {
          return this;
        },
      };
    },
  } as unknown) as Store<S & NextStateExt, A> &
    NextExt & {
      liftedStore: Store<
        LiftedState<S, A, MonitorState> & NextStateExt,
        LiftedAction<S, A, MonitorState>
      >;
    };
}

export interface Options<
  S,
  A extends Action<unknown>,
  MonitorState,
  MonitorAction extends Action<unknown>
> {
  maxAge?:
    | number
    | ((
        currentLiftedAction: LiftedAction<S, A, MonitorState>,
        previousLiftedState: LiftedState<S, A, MonitorState> | undefined
      ) => number);
  shouldCatchErrors?: boolean;
  shouldRecordChanges?: boolean;
  pauseActionType?: unknown;
  shouldStartLocked?: boolean;
  shouldHotReload?: boolean;
  trace?: boolean | ((action: A) => string | undefined);
  traceLimit?: number;
  shouldIncludeCallstack?: boolean;
}

/**
 * Redux instrumentation store enhancer.
 */
export default function instrument<
  OptionsS,
  OptionsA extends Action<unknown>,
  MonitorState = null,
  MonitorAction extends Action<unknown> = never
>(
  monitorReducer: Reducer<MonitorState, MonitorAction> = ((() =>
    null) as unknown) as Reducer<MonitorState, MonitorAction>,
  options: Options<OptionsS, OptionsA, MonitorState, MonitorAction> = {}
): StoreEnhancer<InstrumentExt<any, any, MonitorState>> {
  if (typeof options.maxAge === 'number' && options.maxAge < 2) {
    throw new Error(
      'DevTools.instrument({ maxAge }) option, if specified, ' +
        'may not be less than 2.'
    );
  }

  return <NextExt, NextStateExt>(
    createStore: StoreEnhancerStoreCreator<NextExt, NextStateExt>
  ) => <S, A extends Action<unknown>>(
    reducer: Reducer<S, A>,
    initialState?: PreloadedState<S>
  ) => {
    function liftReducer(r: Reducer<S, A>) {
      if (typeof r !== 'function') {
        if (r && typeof (r as { default: unknown }).default === 'function') {
          throw new Error(
            'Expected the reducer to be a function. ' +
              'Instead got an object with a "default" field. ' +
              'Did you pass a module instead of the default export? ' +
              'Try passing require(...).default instead.'
          );
        }
        throw new Error('Expected the reducer to be a function.');
      }
      return liftReducerWith<S, A, MonitorState, MonitorAction>(
        r,
        initialState,
        monitorReducer,
        (options as unknown) as Options<S, A, MonitorState, MonitorAction>
      );
    }

    const liftedStore = createStore(liftReducer(reducer));
    if (
      (liftedStore as Store<
        LiftedState<S, A, MonitorState> & NextStateExt,
        LiftedAction<S, A, MonitorState>
      > &
        NextExt & {
          liftedStore: Store<
            LiftedState<S, A, MonitorState>,
            LiftedAction<S, A, MonitorState>
          >;
        }).liftedStore
    ) {
      throw new Error(
        'DevTools instrumentation should not be applied more than once. ' +
          'Check your store configuration.'
      );
    }

    return unliftStore<
      S,
      A,
      MonitorState,
      MonitorAction,
      NextExt,
      NextStateExt
    >(
      liftedStore,
      liftReducer,
      (options as unknown) as Options<S, A, MonitorState, MonitorAction>
    );
  };
}
