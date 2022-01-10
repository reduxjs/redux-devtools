import { CHANGE_SECTION } from '../constants/actionTypes';
import { StoreAction } from '../actions';

export type SectionState = string;

export function section(state = 'Actions', action: StoreAction) {
  if (action.type === CHANGE_SECTION) {
    return action.section;
  }
  return state;
}
