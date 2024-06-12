import commitExcessActions from './commitExcessActions';
import { State } from '../reducers/instances';
import { Action } from 'redux';
import { PerformAction } from '@redux-devtools/core';

export function recompute(
  previousLiftedState: State,
  storeState: State,
  action:
    | PerformAction<Action<string>>
    | { action: Action<string>; timestamp?: number; stack?: string },
  nextActionId = 1,
  maxAge?: number,
  isExcess?: boolean,
) {
  const actionId = nextActionId - 1;
  const liftedState = { ...previousLiftedState };

  if (
    liftedState.currentStateIndex ===
    liftedState.stagedActionIds.length - 1
  ) {
    liftedState.currentStateIndex++;
  }
  liftedState.stagedActionIds = [...liftedState.stagedActionIds, actionId];
  liftedState.actionsById = { ...liftedState.actionsById };
  if ((action as PerformAction<Action<string>>).type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action as PerformAction<Action<string>>;
  } else {
    liftedState.actionsById[actionId] = {
      action: action.action || action,
      timestamp: action.timestamp || Date.now(),
      stack: action.stack,
      type: 'PERFORM_ACTION',
    };
  }
  liftedState.nextActionId = nextActionId;
  liftedState.computedStates = [
    ...liftedState.computedStates,
    { state: storeState },
  ];

  if (isExcess) commitExcessActions(liftedState);
  else if (maxAge) {
    const excess = liftedState.stagedActionIds.length - maxAge;
    if (excess > 0) commitExcessActions(liftedState, excess);
  }

  return liftedState;
}
