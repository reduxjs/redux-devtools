import { Action } from 'redux';
import { LiftedState, PerformAction } from '@redux-devtools/instrument';
import { LocalFilter } from '@redux-devtools/utils';

export type FilterStateValue =
  | 'DO_NOT_FILTER'
  | 'DENYLIST_SPECIFIC'
  | 'ALLOWLIST_SPECIFIC';

export const FilterState: { [K in FilterStateValue]: FilterStateValue } = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  DENYLIST_SPECIFIC: 'DENYLIST_SPECIFIC',
  ALLOWLIST_SPECIFIC: 'ALLOWLIST_SPECIFIC',
};

export const noFiltersApplied = (localFilter: LocalFilter | undefined) =>
  // !predicate &&
  !localFilter &&
  (!window.devToolsOptions ||
    !window.devToolsOptions.filter ||
    window.devToolsOptions.filter === FilterState.DO_NOT_FILTER);

export function isFiltered<A extends Action<string>>(
  action: A | string,
  localFilter: LocalFilter | undefined,
) {
  if (
    noFiltersApplied(localFilter) ||
    (typeof action !== 'string' && typeof action.type.match !== 'function')
  ) {
    return false;
  }

  const { allowlist, denylist } = localFilter || window.devToolsOptions || {};
  const actionType = ((action as A).type || action) as string;
  return (
    (allowlist && !actionType.match(allowlist)) ||
    (denylist && actionType.match(denylist))
  );
}

function filterActions<A extends Action<string>>(
  actionsById: { [p: number]: PerformAction<A> },
  actionSanitizer: ((action: A, id: number) => A) | undefined,
): { [p: number]: PerformAction<A> } {
  if (!actionSanitizer) return actionsById;
  return Object.fromEntries(
    Object.entries(actionsById).map(([actionId, action]) => [
      actionId,
      {
        ...action,
        action: actionSanitizer(action.action, actionId as unknown as number),
      },
    ]),
  );
}

function filterStates<S>(
  computedStates: { state: S; error?: string | undefined }[],
  stateSanitizer: ((state: S, index: number) => S) | undefined,
) {
  if (!stateSanitizer) return computedStates;
  return computedStates.map((state, idx) => ({
    ...state,
    state: stateSanitizer(state.state, idx),
  }));
}

export function filterState<S, A extends Action<string>>(
  state: LiftedState<S, A, unknown>,
  localFilter: LocalFilter | undefined,
  stateSanitizer: ((state: S, index: number) => S) | undefined,
  actionSanitizer: ((action: A, id: number) => A) | undefined,
  predicate: ((state: S, action: A) => boolean) | undefined,
): LiftedState<S, A, unknown> {
  if (predicate || !noFiltersApplied(localFilter)) {
    const filteredStagedActionIds: number[] = [];
    const filteredComputedStates: { state: S; error?: string | undefined }[] =
      [];
    const sanitizedActionsById: { [p: number]: PerformAction<A> } | undefined =
      actionSanitizer && {};
    const { actionsById } = state;
    const { computedStates } = state;

    state.stagedActionIds.forEach((id, idx) => {
      const liftedAction = actionsById[id];
      if (!liftedAction) return;
      const currAction = liftedAction.action;
      const liftedState = computedStates[idx];
      const currState = liftedState.state;
      if (idx) {
        if (predicate && !predicate(currState, currAction)) return;
        if (isFiltered(currAction, localFilter)) return;
      }

      filteredStagedActionIds.push(id);
      filteredComputedStates.push(
        stateSanitizer
          ? { ...liftedState, state: stateSanitizer(currState, idx) }
          : liftedState,
      );
      if (actionSanitizer) {
        sanitizedActionsById![id] = {
          ...liftedAction,
          action: actionSanitizer(currAction, id),
        };
      }
    });

    return {
      ...state,
      actionsById: sanitizedActionsById || actionsById,
      stagedActionIds: filteredStagedActionIds,
      computedStates: filteredComputedStates,
    };
  }

  if (!stateSanitizer && !actionSanitizer) return state;
  return {
    ...state,
    actionsById: filterActions(state.actionsById, actionSanitizer),
    computedStates: filterStates(state.computedStates, stateSanitizer),
  };
}

export interface PartialLiftedState<S, A extends Action<string>> {
  readonly actionsById: { [actionId: number]: PerformAction<A> };
  readonly computedStates: { state: S; error?: string }[];
  readonly stagedActionIds: readonly number[];
  readonly currentStateIndex: number;
  readonly nextActionId: number;
  readonly committedState?: S;
}

export function startingFrom<S, A extends Action<string>>(
  sendingActionId: number,
  state: LiftedState<S, A, unknown>,
  localFilter: LocalFilter | undefined,
  stateSanitizer: (<S>(state: S, index: number) => S) | undefined,
  actionSanitizer:
    | (<A extends Action<string>>(action: A, id: number) => A)
    | undefined,
  predicate:
    | (<S, A extends Action<string>>(state: S, action: A) => boolean)
    | undefined,
): LiftedState<S, A, unknown> | PartialLiftedState<S, A> | undefined {
  const stagedActionIds = state.stagedActionIds;
  if (sendingActionId <= stagedActionIds[1]) return state;
  const index = stagedActionIds.indexOf(sendingActionId);
  if (index === -1) return state;

  const shouldFilter = predicate || !noFiltersApplied(localFilter);
  const filteredStagedActionIds = shouldFilter ? [0] : stagedActionIds;
  const actionsById = state.actionsById;
  const computedStates = state.computedStates;
  const newActionsById: { [key: number]: PerformAction<A> } = {};
  const newComputedStates = [];
  let key;
  let currAction;
  let currState;

  for (let i = shouldFilter ? 1 : index; i < stagedActionIds.length; i++) {
    key = stagedActionIds[i];
    currAction = actionsById[key];
    currState = computedStates[i];

    if (shouldFilter) {
      if (
        (predicate && !predicate(currState.state, currAction.action)) ||
        isFiltered(currAction.action, localFilter)
      ) {
        continue;
      }
      filteredStagedActionIds.push(key);
      if (i < index) continue;
    }

    newActionsById[key] = !actionSanitizer
      ? currAction
      : { ...currAction, action: actionSanitizer(currAction.action, key) };
    newComputedStates.push(
      !stateSanitizer
        ? currState
        : { ...currState, state: stateSanitizer(currState.state, i) },
    );
  }

  if (newComputedStates.length === 0) return undefined;

  return {
    actionsById: newActionsById,
    computedStates: newComputedStates,
    stagedActionIds: filteredStagedActionIds,
    currentStateIndex: state.currentStateIndex,
    nextActionId: state.nextActionId,
  };
}
