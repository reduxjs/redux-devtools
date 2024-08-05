// Based on https://github.com/gaearon/redux-devtools/pull/241
/* eslint-disable no-param-reassign */

import { State } from '../reducers/instances';

export default function commitExcessActions(liftedState: State, n = 1) {
  // Auto-commits n-number of excess actions.
  let excess = n;
  let idsToDelete = liftedState.stagedActionIds.slice(1, excess + 1);

  for (let i = 0; i < idsToDelete.length; i++) {
    if (liftedState.computedStates[i + 1].error) {
      // Stop if error is found. Commit actions up to error.
      excess = i;
      idsToDelete = liftedState.stagedActionIds.slice(1, excess + 1);
      break;
    } else {
      delete liftedState.actionsById[idsToDelete[i]];
    }
  }

  liftedState.skippedActionIds = liftedState.skippedActionIds.filter(
    (id) => !idsToDelete.includes(id),
  );
  liftedState.stagedActionIds = [
    0,
    ...liftedState.stagedActionIds.slice(excess + 1),
  ];
  liftedState.committedState = liftedState.computedStates[excess].state;
  liftedState.computedStates = liftedState.computedStates.slice(excess);
  liftedState.currentStateIndex =
    liftedState.currentStateIndex > excess
      ? liftedState.currentStateIndex - excess
      : 0;
}
