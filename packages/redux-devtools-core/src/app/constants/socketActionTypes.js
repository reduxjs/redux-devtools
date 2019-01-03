import socketCluster from 'socketcluster-client';

export const {
  CLOSED, CONNECTING, OPEN, AUTHENTICATED, PENDING, UNAUTHENTICATED
  } = socketCluster.SCSocket;
export const CONNECT_REQUEST = 'socket/CONNECT_REQUEST';
export const CONNECT_SUCCESS = 'socket/CONNECT_SUCCESS';
export const CONNECT_ERROR = 'socket/CONNECT_ERROR';
export const RECONNECT = 'socket/RECONNECT';
export const AUTH_REQUEST = 'socket/AUTH_REQUEST';
export const AUTH_SUCCESS = 'socket/AUTH_SUCCESS';
export const AUTH_ERROR = 'socket/AUTH_ERROR';
export const DISCONNECTED = 'socket/DISCONNECTED';
export const DEAUTHENTICATE = 'socket/DEAUTHENTICATE';
export const SUBSCRIBE_REQUEST = 'socket/SUBSCRIBE_REQUEST';
export const SUBSCRIBE_SUCCESS = 'socket/SUBSCRIBE_SUCCESS';
export const SUBSCRIBE_ERROR = 'socket/SUBSCRIBE_ERROR';
export const UNSUBSCRIBE = 'socket/UNSUBSCRIBE';
export const EMIT = 'socket/EMIT';
