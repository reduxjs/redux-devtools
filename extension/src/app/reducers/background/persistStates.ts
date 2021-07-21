import { BackgroundAction } from '../../stores/backgroundStore';

export default function persistStates(state = false, action: BackgroundAction) {
  if (action.type === 'TOGGLE_PERSIST') return !state;
  return state;
}
