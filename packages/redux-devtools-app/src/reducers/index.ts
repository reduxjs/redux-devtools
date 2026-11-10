import type { CoreStoreState } from '@redux-devtools/app-core';
import { coreReducers } from '@redux-devtools/app-core';
import { combineReducers } from 'redux';
import type { ConnectionState } from './connection.js';
import { connection } from './connection.js';
import type { SocketState } from './socket.js';
import { socket } from './socket.js';

export interface StoreState extends CoreStoreState {
  readonly connection: ConnectionState;
  readonly socket: SocketState;
}

export const rootReducer = combineReducers({
  ...coreReducers,
  connection,
  socket,
});
