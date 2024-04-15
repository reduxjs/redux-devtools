import { CoreStoreState, coreReducers } from '@redux-devtools/app-core';
import { combineReducers } from 'redux';
import { connection, ConnectionState } from './connection';
import { socket, SocketState } from './socket';
import { StoreAction } from '../actions';

export interface StoreState extends CoreStoreState {
  readonly connection: ConnectionState;
  readonly socket: SocketState;
}

/// @ts-expect-error An error happens due to TypeScript not being able to reconcile a clash between CoreStoreAction and StoreAction in the core reducers, but this is correct as they're a superset
export const rootReducer = combineReducers<StoreState, StoreAction>({
  ...coreReducers,
  connection,
  socket,
});
