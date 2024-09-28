import { PerformAction } from '@redux-devtools/core';
import { Action } from 'redux';

export interface State {
  actionsById: { [actionId: number]: PerformAction<Action<string>> };
  computedStates: { state: unknown; error?: string }[];
  stagedActionIds: number[];
}

export const FilterState = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  DENYLIST_SPECIFIC: 'DENYLIST_SPECIFIC',
  ALLOWLIST_SPECIFIC: 'ALLOWLIST_SPECIFIC',
};

export function arrToRegex(v: string | string[]) {
  return typeof v === 'string' ? v : v.join('|');
}

function filterActions(
  actionsById: { [actionId: number]: PerformAction<Action<string>> },
  actionSanitizer: ((action: Action<string>, id: number) => Action) | undefined,
) {
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

function filterStates(
  computedStates: { state: unknown; error?: string | undefined }[],
  stateSanitizer: (state: unknown, actionId: number) => unknown,
) {
  if (!stateSanitizer) return computedStates;
  return computedStates.map((state, idx) => ({
    ...state,
    state: stateSanitizer(state.state, idx),
  }));
}

function isArray(arg: unknown): arg is readonly unknown[] {
  return Array.isArray(arg);
}

interface Config {
  /**
   * @deprecated Use actionsDenylist instead.
   */
  readonly actionsBlacklist?: string | readonly string[];
  /**
   * @deprecated Use actionsAllowlist instead.
   */
  readonly actionsWhitelist?: string | readonly string[];
  readonly actionsDenylist?: string | readonly string[];
  readonly actionsAllowlist?: string | readonly string[];
}

export interface LocalFilter {
  allowlist: string | undefined;
  denylist: string | undefined;
}

export function getLocalFilter(config: Config): LocalFilter | undefined {
  const denylist = config.actionsDenylist ?? config.actionsBlacklist;
  const allowlist = config.actionsAllowlist ?? config.actionsWhitelist;
  if (denylist || allowlist) {
    return {
      allowlist: isArray(allowlist) ? allowlist.join('|') : allowlist,
      denylist: isArray(denylist) ? denylist.join('|') : denylist,
    };
  }
  return undefined;
}

interface DevToolsOptions {
  filter?:
    | typeof FilterState.DO_NOT_FILTER
    | typeof FilterState.DENYLIST_SPECIFIC
    | typeof FilterState.ALLOWLIST_SPECIFIC;
  allowlist?: string;
  denylist?: string;
}
function getDevToolsOptions() {
  return (
    (typeof window !== 'undefined' &&
      (window as { devToolsOptions?: DevToolsOptions }).devToolsOptions) ||
    {}
  );
}

export function isFiltered(
  action: PerformAction<Action<string>> | Action<string>,
  localFilter?: LocalFilter,
) {
  const { type } = (action as PerformAction<Action<string>>).action || action;
  const opts = getDevToolsOptions();
  if (
    (!localFilter &&
      opts.filter &&
      opts.filter === FilterState.DO_NOT_FILTER) ||
    (type && typeof type.match !== 'function')
  )
    return false;

  const { allowlist, denylist } = localFilter || opts;
  return (
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    (allowlist && !type.match(allowlist)) ||
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    (denylist && type.match(denylist))
  );
}

export function filterStagedActions(
  state: State,
  filters: LocalFilter | undefined,
) {
  if (!filters) return state;

  const filteredStagedActionIds: number[] = [];
  const filteredComputedStates: {
    state: unknown;
    error?: string | undefined;
  }[] = [];

  state.stagedActionIds.forEach((id, idx) => {
    if (!isFiltered(state.actionsById[id], filters)) {
      filteredStagedActionIds.push(id);
      filteredComputedStates.push(state.computedStates[idx]);
    }
  });

  return {
    ...state,
    stagedActionIds: filteredStagedActionIds,
    computedStates: filteredComputedStates,
  };
}

export function filterState(
  state: State,
  type: string,
  localFilter: LocalFilter | undefined,
  stateSanitizer: ((state: unknown, actionId: number) => unknown) | undefined,
  actionSanitizer: ((action: Action<string>, id: number) => Action) | undefined,
  nextActionId: number,
  predicate?: (currState: unknown, currAction: Action<string>) => boolean,
) {
  if (type === 'ACTION')
    return !stateSanitizer ? state : stateSanitizer(state, nextActionId - 1);
  else if (type !== 'STATE') return state;

  const { filter } = getDevToolsOptions();
  if (
    predicate ||
    localFilter ||
    (filter && filter !== FilterState.DO_NOT_FILTER)
  ) {
    const filteredStagedActionIds: number[] = [];
    const filteredComputedStates: {
      state: unknown;
      error?: string | undefined;
    }[] = [];
    const sanitizedActionsById:
      | {
          [id: number]: PerformAction<Action<string>>;
        }
      | undefined = actionSanitizer && {};
    const { actionsById } = state;
    const { computedStates } = state;

    state.stagedActionIds.forEach((id, idx) => {
      const liftedAction = actionsById[id];
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
    computedStates: filterStates(state.computedStates, stateSanitizer!),
  };
}
