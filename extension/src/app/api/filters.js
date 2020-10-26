import mapValues from 'lodash/mapValues';

export const FilterState = {
  DO_NOT_FILTER: 'DO_NOT_FILTER',
  BLACKLIST_SPECIFIC: 'BLACKLIST_SPECIFIC',
  WHITELIST_SPECIFIC: 'WHITELIST_SPECIFIC'
};

export function getLocalFilter(config) {
  if (config.actionsBlacklist || config.actionsWhitelist) {
    return {
      whitelist: Array.isArray(config.actionsWhitelist) ? config.actionsWhitelist.join('|') : config.actionsWhitelist,
      blacklist: Array.isArray(config.actionsBlacklist) ? config.actionsBlacklist.join('|') : config.actionsBlacklist
    };
  }
  return undefined;
}

export const noFiltersApplied = (localFilter) => (
  // !predicate &&
  !localFilter && (!window.devToolsOptions || !window.devToolsOptions.filter ||
  window.devToolsOptions.filter === FilterState.DO_NOT_FILTER)
);

export function isFiltered(action, localFilter) {
  if (
    noFiltersApplied(localFilter) ||
    typeof action !== 'string' && typeof action.type.match !== 'function'
  ) return false;

  const { whitelist, blacklist } = localFilter || window.devToolsOptions || {};
  const actionType = action.type || action;
  return (
    whitelist && !actionType.match(whitelist) ||
    blacklist && actionType.match(blacklist)
  );
}

function filterActions(actionsById, actionSanitizer) {
  if (!actionSanitizer) return actionsById;
  return mapValues(actionsById, (action, id) => (
    { ...action, action: actionSanitizer(action.action, id) }
  ));
}

function filterStates(computedStates, stateSanitizer) {
  if (!stateSanitizer) return computedStates;
  return computedStates.map((state, idx) => (
    { ...state, state: stateSanitizer(state.state, idx) }
  ));
}

export function filterState(state, type, localFilter, stateSanitizer, actionSanitizer, nextActionId, predicate) {
  if (type === 'ACTION') return !stateSanitizer ? state : stateSanitizer(state, nextActionId - 1);
  else if (type !== 'STATE') return state;

  if (predicate || !noFiltersApplied(localFilter)) {
    const filteredStagedActionIds = [];
    const filteredComputedStates = [];
    const sanitizedActionsById = actionSanitizer && {};
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

export function startingFrom(
  sendingActionId, state, localFilter, stateSanitizer, actionSanitizer, predicate
) {
  const stagedActionIds = state.stagedActionIds;
  if (sendingActionId <= stagedActionIds[1]) return state;
  const index = stagedActionIds.indexOf(sendingActionId);
  if (index === -1) return state;

  const shouldFilter = predicate || !noFiltersApplied(localFilter);
  const filteredStagedActionIds = shouldFilter ? [0] : stagedActionIds;
  const actionsById = state.actionsById;
  const computedStates = state.computedStates;
  const newActionsById = {};
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
        predicate && !predicate(currState.state, currAction.action) ||
        isFiltered(currAction.action, localFilter)
      ) continue;
      filteredStagedActionIds.push(key);
      if (i < index) continue;
    }

    newActionsById[key] = !actionSanitizer ? currAction :
      { ...currAction, action: actionSanitizer(currAction.action, key) };
    newComputedStates.push(
      !stateSanitizer ? currState : { ...currState, state: stateSanitizer(currState.state, i) }
    );
  }

  if (newComputedStates.length === 0) return undefined;

  return {
    actionsById: newActionsById,
    computedStates: newComputedStates,
    stagedActionIds: filteredStagedActionIds,
    currentStateIndex: state.currentStateIndex,
    nextActionId: state.nextActionId
  };
}
