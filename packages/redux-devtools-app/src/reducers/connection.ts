import { RECONNECT } from '../constants/socketActionTypes';
import { ConnectionType, StoreAction } from '../actions';

export interface ConnectionStateOptions {
  readonly hostname: string;
  readonly port: number;
  readonly secure: boolean;
}
export interface ConnectionState {
  readonly options: ConnectionStateOptions;
  readonly type: ConnectionType;
}

export function connection(
  state: ConnectionState = {
    options: { hostname: 'localhost', port: 8000, secure: false },
    type: 'disabled',
  },
  action: StoreAction,
) {
  if (action.type === RECONNECT) {
    const { type, ...options } = action.options;
    return { ...state, type, options };
  }
  return state;
}
