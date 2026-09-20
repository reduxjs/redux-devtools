import { CHANGE_SECTION } from '../constants/actionTypes.js';
import { CoreStoreAction } from '../actions/index.js';

export type SectionState = string;

export function section(state = 'Actions', action: CoreStoreAction) {
  if (action.type === CHANGE_SECTION) {
    return action.section;
  }
  return state;
}
