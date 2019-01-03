import commitExcessActions from './commitExcessActions';

/* eslint-disable import/prefer-default-export */
export function recompute(previousLiftedState, storeState, action, nextActionId = 1, maxAge, isExcess) {
  const actionId = nextActionId - 1;
  const liftedState = { ...previousLiftedState };

  if (liftedState.currentStateIndex === liftedState.stagedActionIds.length - 1) {
    liftedState.currentStateIndex++;
  }
  liftedState.stagedActionIds = [...liftedState.stagedActionIds, actionId];
  liftedState.actionsById = { ...liftedState.actionsById };
  if (action.type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action;
  } else {
    liftedState.actionsById[actionId] = {
      action: action.action || action,
      timestamp: action.timestamp || Date.now(),
      type: 'PERFORM_ACTION'
    };
  }
  liftedState.nextActionId = nextActionId;
  liftedState.computedStates = [...liftedState.computedStates, { state: storeState }];

  if (isExcess) commitExcessActions(liftedState);
  else if (maxAge) {
    const excess = liftedState.stagedActionIds.length - maxAge;
    if (excess > 0) commitExcessActions(liftedState, excess);
  }

  return liftedState;
}
