import mapValues from 'lodash/mapValues';
import { PerformAction } from 'redux-devtools';
import { Action } from 'redux';
import { State } from '../app/reducers/instances';

export const FilterState = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  BLACKLIST_SPECIFIC: 'BLACKLIST_SPECIFIC',
  WHITELIST_SPECIFIC: 'WHITELIST_SPECIFIC',
};

export function arrToRegex(v: string | string[]) {
  return typeof v === 'string' ? v : v.join('|');
}

function filterActions(
  actionsById: { [actionId: number]: PerformAction<Action<unknown>> },
  actionsFilter: (action: Action<unknown>, id: number) => Action
) {
  if (!actionsFilter) return actionsById;
  return mapValues(actionsById, (action, id: number) => ({
    ...action,
    action: actionsFilter(action.action, id),
  }));
}

function filterStates(
  computedStates: { state: unknown; error?: string | undefined }[],
  statesFilter: (state: unknown, actionId: number) => unknown
) {
  if (!statesFilter) return computedStates;
  return computedStates.map((state, idx) => ({
    ...state,
    state: statesFilter(state.state, idx),
  }));
}

interface Config {
  actionsBlacklist?: string[];
  actionsWhitelist?: string[];
}

interface LocalFilter {
  whitelist?: string;
  blacklist?: string;
}

export function getLocalFilter(config: Config): LocalFilter | undefined {
  if (config.actionsBlacklist || config.actionsWhitelist) {
    return {
      whitelist: config.actionsWhitelist && config.actionsWhitelist.join('|'),
      blacklist: config.actionsBlacklist && config.actionsBlacklist.join('|'),
    };
  }
  return undefined;
}

interface DevToolsOptions {
  filter?:
    | typeof FilterState.DO_NOT_FILTER
    | typeof FilterState.BLACKLIST_SPECIFIC
    | typeof FilterState.WHITELIST_SPECIFIC;
  whitelist?: string;
  blacklist?: string;
}
function getDevToolsOptions() {
  return (
    (typeof window !== 'undefined' &&
      (window as { devToolsOptions?: DevToolsOptions }).devToolsOptions) ||
    {}
  );
}

export function isFiltered(
  action: PerformAction<Action<unknown>> | Action<unknown>,
  localFilter?: LocalFilter
) {
  const { type } = (action as PerformAction<Action<unknown>>).action || action;
  const opts = getDevToolsOptions();
  if (
    (!localFilter &&
      opts.filter &&
      opts.filter === FilterState.DO_NOT_FILTER) ||
    (type && typeof (type as string).match !== 'function')
  )
    return false;

  const { whitelist, blacklist } = localFilter || opts;
  return (
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    (whitelist && !(type as string).match(whitelist)) ||
    // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
    (blacklist && (type as string).match(blacklist))
  );
}

export function filterStagedActions(state: State, filters: LocalFilter) {
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
  localFilter: LocalFilter,
  stateSanitizer: (state: unknown, actionId: number) => unknown,
  actionSanitizer: (action: Action<unknown>, id: number) => Action,
  nextActionId: number,
  predicate: (currState: unknown, currAction: Action<unknown>) => boolean
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
    const sanitizedActionsById: {
      [id: number]: PerformAction<Action<unknown>>;
    } = actionSanitizer && {};
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
          : liftedState
      );
      if (actionSanitizer) {
        sanitizedActionsById[id] = {
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
