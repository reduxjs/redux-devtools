import { RECONNECT } from '../constants/socketActionTypes';
import { StoreAction } from '../actions';

interface ConnectionOptions {
  readonly hostname: string;
  readonly port: number;
  readonly secure: boolean;
}
export interface ConnectionState {
  readonly options: ConnectionOptions;
  readonly type: 'disabled' | 'remotedev' | 'custom';
}

export default function connection(
  state: ConnectionState = {
    options: { hostname: 'localhost', port: 8000, secure: false },
    type: 'remotedev',
  },
  action: StoreAction
) {
  if (action.type === RECONNECT) {
    const { type, ...options } = action.options;
    return { ...state, type, options };
  }
  return state;
}
