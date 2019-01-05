import difference from 'lodash/difference';
import omit from 'lodash/omit';
import stringifyJSON from './stringifyJSON';
import { SET_STATE } from '../constants/actionTypes';

export function sweep(state) {
  return {
    ...state,
    actionsById: omit(state.actionsById, state.skippedActionIds),
    stagedActionIds: difference(state.stagedActionIds, state.skippedActionIds),
    skippedActionIds: [],
    currentStateIndex: Math.min(state.currentStateIndex, state.stagedActionIds.length - 1)
  };
}

export function nonReduxDispatch(store, message, instanceId, action, initialState, preInstances) {
  const instances = preInstances || store.getState().instances;
  const state = instances.states[instanceId];
  const options = instances.options[instanceId];

  if (message !== 'DISPATCH') {
    if (message === 'IMPORT') {
      if (options.features.import === true) {
        return stringifyJSON(state.computedStates[state.currentStateIndex].state, true);
      }
      return initialState;
    }
    return undefined;
  }

  if (options.lib === 'redux') return undefined;

  switch (action.type) {
    case 'TOGGLE_ACTION':
      return stringifyJSON(state, true);
    case 'JUMP_TO_STATE':
      return stringifyJSON(state.computedStates[action.index].state, true);
    case 'JUMP_TO_ACTION':
      return stringifyJSON(
        state.computedStates[state.stagedActionIds.indexOf(action.actionId)].state, true
      );
    case 'ROLLBACK':
      return stringifyJSON(state.computedStates[0].state, true);
    case 'SWEEP':
      store.dispatch({ type: SET_STATE, newState: sweep(state) });
      return undefined;
    default:
      return undefined;
  }
}
