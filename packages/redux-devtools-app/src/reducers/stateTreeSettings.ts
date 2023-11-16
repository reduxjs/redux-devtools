import { StoreAction } from '../actions';
import { CHANGE_STATE_TREE_SETTINGS } from '../constants/actionTypes';

export interface StateTreeSettings {
  readonly sortAlphabetically: boolean;
  readonly disableCollection: boolean;
  readonly enableSearchPanel: boolean;
}

export function stateTreeSettings(
  state: StateTreeSettings = {
    sortAlphabetically: false,
    disableCollection: false,
    enableSearchPanel: false,
  },
  action: StoreAction,
) {
  if (action.type === CHANGE_STATE_TREE_SETTINGS) {
    return {
      sortAlphabetically: action.sortAlphabetically,
      disableCollection: action.disableCollection,
      enableSearchPanel: action.enableSearchPanel,
    };
  }
  return state;
}
