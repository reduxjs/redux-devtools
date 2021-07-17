import { StoreAction } from '@redux-devtools/app/lib/actions';

export default function persistStates(state = false, action: StoreAction) {
  if (action.type === 'TOGGLE_PERSIST') return !state;
  return state;
}
