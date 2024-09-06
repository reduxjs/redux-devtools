import { CoreStoreState, coreReducers } from '@redux-devtools/app-core';
import { combineReducers } from 'redux';
import { connection, ConnectionState } from './connection';
import { socket, SocketState } from './socket';

export interface StoreState extends CoreStoreState {
  readonly connection: ConnectionState;
  readonly socket: SocketState;
}

export const rootReducer = combineReducers({
  ...coreReducers,
  connection,
  socket,
});
