import commitExcessActions from './commitExcessActions';
import { State } from '../reducers/instances';
import { Action } from 'redux';
import { PerformAction } from 'redux-devtools-instrument';

export function recompute(
  previousLiftedState: State,
  storeState: State,
  action: Action<unknown>,
  nextActionId = 1,
  maxAge?: number,
  isExcess?: boolean
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
  if (action.type === 'PERFORM_ACTION') {
    liftedState.actionsById[actionId] = action as PerformAction<
      Action<unknown>
    >;
  } else {
    liftedState.actionsById[actionId] = {
      action: (action as any).action || action,
      timestamp: (action as any).timestamp || Date.now(),
      stack: (action as any).stack,
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
