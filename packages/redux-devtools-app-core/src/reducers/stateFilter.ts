import { StateFilterValue } from '@redux-devtools/ui/lib/types/StateFilter/StateFilter';
import { CoreStoreAction } from '../actions';
import { SET_STATE_FILTER } from '../constants/actionTypes';

export type StateFilterState = StateFilterValue;

export function stateFilter(
  state: StateFilterState = {
    isJsonPath: false,
    searchString: '',
  },
  action: CoreStoreAction,
): StateFilterState {
  if (action.type === SET_STATE_FILTER) {
    return { ...state, ...action.stateFilter };
  }
  return state;
}
