import { RECONNECT } from '../constants/socketActionTypes';

export default function connection(
  state = {
    options: { hostname: 'localhost', port: 8000, secure: false },
    type: 'remotedev'
  },
  action
) {
  if (action.type === RECONNECT) {
    const { type, ...options } = action.options;
    return { ...state, type, options };
  }
  return state;
}
