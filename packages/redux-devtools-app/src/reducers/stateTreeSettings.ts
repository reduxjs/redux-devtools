import { CHANGE_STATE_TREE_SETTINGS } from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface StateTreeSettings {
  readonly sortAlphabetically: boolean;
  readonly disableCollection: boolean;
}

export function stateTreeSettings(
  state: StateTreeSettings = {
    sortAlphabetically: false,
    disableCollection: false,
  },
  action: StoreAction
) {
  if (action.type === CHANGE_STATE_TREE_SETTINGS) {
    return {
      sortAlphabetically: action.sortAlphabetically,
      disableCollection: action.disableCollection,
    };
  }
  return state;
}
