import { CoreStoreState, coreReducers } from '@redux-devtools/app-core';
import { combineReducers } from 'redux';
import { connection, ConnectionState } from './connection.js';
import { socket, SocketState } from './socket.js';

export interface StoreState extends CoreStoreState {
  readonly connection: ConnectionState;
  readonly socket: SocketState;
}

export const rootReducer = combineReducers({
  ...coreReducers,
  connection,
  socket,
});
