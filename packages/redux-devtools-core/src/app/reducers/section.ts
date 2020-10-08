import { CHANGE_SECTION } from '../constants/actionTypes';

export default function section(state = 'Actions', action) {
  if (action.type === CHANGE_SECTION) {
    return action.section;
  }
  return state;
}
