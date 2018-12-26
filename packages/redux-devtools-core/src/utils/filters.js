import mapValues from 'lodash/mapValues';

export const FilterState = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  BLACKLIST_SPECIFIC: 'BLACKLIST_SPECIFIC',
  WHITELIST_SPECIFIC: 'WHITELIST_SPECIFIC'
};

export function arrToRegex(v) {
  return typeof v === 'string' ? v : v.join('|');
}

function filterActions(actionsById, actionsFilter) {
  if (!actionsFilter) return actionsById;
  return mapValues(actionsById, (action, id) => (
  { ...action, action: actionsFilter(action.action, id) }
  ));
}

function filterStates(computedStates, statesFilter) {
  if (!statesFilter) return computedStates;
  return computedStates.map((state, idx) => (
  { ...state, state: statesFilter(state.state, idx) }
  ));
}

export function getLocalFilter(config) {
  if (config.actionsBlacklist || config.actionsWhitelist) {
    return {
      whitelist: config.actionsWhitelist && config.actionsWhitelist.join('|'),
      blacklist: config.actionsBlacklist && config.actionsBlacklist.join('|')
    };
  }
  return undefined;
}

function getDevToolsOptions() {
  return typeof window !== 'undefined' && window.devToolsOptions || {};
}

export function isFiltered(action, localFilter) {
  const { type } = action.action || action;
  const opts = getDevToolsOptions();
  if (
    !localFilter && (opts.filter && opts.filter === FilterState.DO_NOT_FILTER) ||
    type && typeof type.match !== 'function'
  ) return false;

  const { whitelist, blacklist } = localFilter || opts;
  return (
    whitelist && !type.match(whitelist) ||
    blacklist && type.match(blacklist)
  );
}

export function filterStagedActions(state, filters) {
  if (!filters) return state;

  const filteredStagedActionIds = [];
  const filteredComputedStates = [];

  state.stagedActionIds.forEach((id, idx) => {
    if (!isFiltered(state.actionsById[id], filters)) {
      filteredStagedActionIds.push(id);
      filteredComputedStates.push(state.computedStates[idx]);
    }
  });

  return { ...state,
    stagedActionIds: filteredStagedActionIds,
    computedStates: filteredComputedStates
  };
}

export function filterState(
  state, type, localFilter, stateSanitizer, actionSanitizer, nextActionId, predicate
) {
  if (type === 'ACTION') return !stateSanitizer ? state : stateSanitizer(state, nextActionId - 1);
  else if (type !== 'STATE') return state;

  const { filter } = getDevToolsOptions();
  if (predicate || localFilter || (filter && filter !== FilterState.DO_NOT_FILTER)) {
    const filteredStagedActionIds = [];
    const filteredComputedStates = [];
    const sanitizedActionsById = actionSanitizer && {};
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
        stateSanitizer ? { ...liftedState, state: stateSanitizer(currState, idx) } : liftedState
      );
      if (actionSanitizer) {
        sanitizedActionsById[id] = {
          ...liftedAction, action: actionSanitizer(currAction, id)
        };
      }
    });

    return {
      ...state,
      actionsById: sanitizedActionsById || actionsById,
      stagedActionIds: filteredStagedActionIds,
      computedStates: filteredComputedStates
    };
  }

  if (!stateSanitizer && !actionSanitizer) return state;
  return {
    ...state,
    actionsById: filterActions(state.actionsById, actionSanitizer),
    computedStates: filterStates(state.computedStates, stateSanitizer)
  };
}
