import { AuthStates, States } from 'socketcluster-client/lib/clientsocket';
import {
  CoreStoreActionWithoutUpdateStateOrLiftedAction,
  LiftedActionAction,
  UPDATE_REPORTS,
  UPDATE_STATE,
  UpdateStateAction,
} from '@redux-devtools/app-core';
import {
  AUTH_ERROR,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  CONNECT_ERROR,
  CONNECT_REQUEST,
  CONNECT_SUCCESS,
  DEAUTHENTICATE,
  DISCONNECTED,
  EMIT,
  RECONNECT,
  SUBSCRIBE_ERROR,
  SUBSCRIBE_REQUEST,
  SUBSCRIBE_SUCCESS,
  UNSUBSCRIBE,
} from '../constants/socketActionTypes';

export type ConnectionType = 'disabled' | 'custom';
export interface ConnectionOptions {
  readonly type: ConnectionType;
  readonly hostname: string;
  readonly port: number;
  readonly secure: boolean;
}
export interface ReconnectAction {
  readonly type: typeof RECONNECT;
  readonly options: ConnectionOptions;
}
export function saveSocketSettings(
  options: ConnectionOptions,
): ReconnectAction {
  return { type: RECONNECT, options };
}

export interface ConnectRequestAction {
  type: typeof CONNECT_REQUEST;
}

interface ConnectSuccessPayload {
  id: string;
  authState: AuthStates;
  socketState: States;
}
export interface ConnectSuccessAction {
  type: typeof CONNECT_SUCCESS;
  payload: ConnectSuccessPayload;
  error: Error | undefined;
}

export interface ConnectErrorAction {
  type: typeof CONNECT_ERROR;
  error: Error | undefined;
}

export interface AuthRequestAction {
  type: typeof AUTH_REQUEST;
}

export interface AuthSuccessAction {
  type: typeof AUTH_SUCCESS;
  baseChannel: string;
}

export interface AuthErrorAction {
  type: typeof AUTH_ERROR;
  error: Error;
}

export interface DisconnectedAction {
  type: typeof DISCONNECTED;
  code: number;
}

export interface DeauthenticateAction {
  type: typeof DEAUTHENTICATE;
}

export interface SubscribeRequestAction {
  type: typeof SUBSCRIBE_REQUEST;
  channel: string;
  subscription: typeof UPDATE_STATE | typeof UPDATE_REPORTS;
}

export interface SubscribeSuccessAction {
  type: typeof SUBSCRIBE_SUCCESS;
  channel: string;
}

export interface SubscribeErrorAction {
  type: typeof SUBSCRIBE_ERROR;
  error: Error;
  status: string;
}

export interface UnsubscribeAction {
  type: typeof UNSUBSCRIBE;
  channel: string;
}

export interface EmitAction {
  type: typeof EMIT;
  message: string;
  id?: string | number | false;
  instanceId?: string | number;
  action?: unknown;
  state?: unknown;
}

export type StoreActionWithoutUpdateStateOrLiftedAction =
  | CoreStoreActionWithoutUpdateStateOrLiftedAction
  | ReconnectAction
  | ConnectRequestAction
  | ConnectSuccessAction
  | ConnectErrorAction
  | AuthRequestAction
  | AuthSuccessAction
  | AuthErrorAction
  | DisconnectedAction
  | DeauthenticateAction
  | SubscribeRequestAction
  | SubscribeSuccessAction
  | SubscribeErrorAction
  | UnsubscribeAction
  | EmitAction;

export type StoreActionWithoutUpdateState =
  | StoreActionWithoutUpdateStateOrLiftedAction
  | LiftedActionAction;

export type StoreActionWithoutLiftedAction =
  | StoreActionWithoutUpdateStateOrLiftedAction
  | UpdateStateAction;

export type StoreAction = StoreActionWithoutUpdateState | UpdateStateAction;
