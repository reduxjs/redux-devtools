import socketCluster, { SCClientSocket } from 'socketcluster-client';
import { stringify } from 'jsan';
import { Dispatch, MiddlewareAPI } from 'redux';
import * as actions from '../constants/socketActionTypes';
import { getActiveInstance } from '../reducers/instances';
import {
  UPDATE_STATE,
  REMOVE_INSTANCE,
  LIFTED_ACTION,
  UPDATE_REPORTS,
  GET_REPORT_REQUEST,
  GET_REPORT_ERROR,
  GET_REPORT_SUCCESS,
} from '../constants/actionTypes';
import {
  showNotification,
  importState,
  StoreAction,
  EmitAction,
  LiftedActionAction,
  Request,
  DispatchAction,
  UpdateReportsRequest,
} from '../actions';
import { nonReduxDispatch } from '../utils/monitorActions';
import { StoreState } from '../reducers';

let socket: SCClientSocket;
let store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>;

function emit({ message: type, id, instanceId, action, state }: EmitAction) {
  socket.emit(id ? `sc-${id}` : 'respond', { type, action, state, instanceId });
}

function startMonitoring(channel: string) {
  if (channel !== store.getState().socket.baseChannel) return;
  store.dispatch({ type: actions.EMIT, message: 'START' });
}

function dispatchRemoteAction({
  message,
  action,
  state,
  toAll,
}: LiftedActionAction) {
  const instances = store.getState().instances;
  const instanceId = getActiveInstance(instances);
  const id = !toAll && instances.options[instanceId].connectionId;
  store.dispatch({
    type: actions.EMIT,
    message,
    action,
    state: nonReduxDispatch(
      store,
      message,
      instanceId,
      action as DispatchAction,
      state,
      instances
    ),
    instanceId,
    id,
  });
}

interface RequestBase {
  id?: string;
  instanceId?: string;
}
interface DisconnectedAction extends RequestBase {
  type: 'DISCONNECTED';
  id: string;
}
interface StartAction extends RequestBase {
  type: 'START';
  id: string;
}
interface ErrorAction extends RequestBase {
  type: 'ERROR';
  payload: string;
}
interface RequestWithData extends RequestBase {
  data: Request;
}
type MonitoringRequest =
  | DisconnectedAction
  | StartAction
  | ErrorAction
  | Request;

function monitoring(request: MonitoringRequest) {
  if (request.type === 'DISCONNECTED') {
    store.dispatch({
      type: REMOVE_INSTANCE,
      id: request.id,
    });
    return;
  }
  if (request.type === 'START') {
    store.dispatch({ type: actions.EMIT, message: 'START', id: request.id });
    return;
  }

  if (request.type === 'ERROR') {
    store.dispatch(showNotification(request.payload));
    return;
  }

  store.dispatch({
    type: UPDATE_STATE,
    request: (request as unknown as RequestWithData).data
      ? { ...(request as unknown as RequestWithData).data, id: request.id }
      : request,
  });

  const instances = store.getState().instances;
  const instanceId = request.instanceId || request.id;
  if (
    instances.sync &&
    instanceId === instances.selected &&
    (request.type === 'ACTION' || request.type === 'STATE')
  ) {
    socket.emit('respond', {
      type: 'SYNC',
      state: stringify(instances.states[instanceId]),
      id: request.id,
      instanceId,
    });
  }
}

function subscribe(
  channelName: string,
  subscription: typeof UPDATE_STATE | typeof UPDATE_REPORTS
) {
  const channel = socket.subscribe(channelName);
  if (subscription === UPDATE_STATE) channel.watch(monitoring);
  else {
    const watcher = (request: UpdateReportsRequest) => {
      store.dispatch({ type: subscription, request });
    };
    channel.watch(watcher);
    socket.on(channelName, watcher);
  }
}

function handleConnection() {
  socket.on('connect', (status) => {
    store.dispatch({
      type: actions.CONNECT_SUCCESS,
      payload: {
        id: status.id,
        authState: socket.authState,
        socketState: socket.state,
      },
      error: status.authError,
    });
    if (socket.authState !== actions.AUTHENTICATED) {
      store.dispatch({ type: actions.AUTH_REQUEST });
    }
  });
  socket.on('disconnect', (code) => {
    store.dispatch({ type: actions.DISCONNECTED, code });
  });

  socket.on('subscribe', (channel) => {
    store.dispatch({ type: actions.SUBSCRIBE_SUCCESS, channel });
  });
  socket.on('unsubscribe', (channel) => {
    socket.unsubscribe(channel);
    socket.unwatch(channel);
    socket.off(channel);
    store.dispatch({ type: actions.UNSUBSCRIBE, channel });
  });
  socket.on('subscribeFail', (error) => {
    store.dispatch({
      type: actions.SUBSCRIBE_ERROR,
      error,
      status: 'subscribeFail',
    });
  });
  socket.on('dropOut', (error) => {
    store.dispatch({ type: actions.SUBSCRIBE_ERROR, error, status: 'dropOut' });
  });

  socket.on('error', (error) => {
    store.dispatch({ type: actions.CONNECT_ERROR, error });
  });
}

function connect() {
  if (process.env.NODE_ENV === 'test') return;
  const connection = store.getState().connection;
  try {
    socket = socketCluster.create(connection.options);
    handleConnection();
  } catch (error) {
    store.dispatch({ type: actions.CONNECT_ERROR, error });
    store.dispatch(showNotification(error.message || error));
  }
}

function disconnect() {
  if (socket) {
    socket.disconnect();
    socket.off();
  }
}

function login() {
  socket.emit('login', {}, (error: Error, baseChannel: string) => {
    if (error) {
      store.dispatch({ type: actions.AUTH_ERROR, error });
      return;
    }
    store.dispatch({ type: actions.AUTH_SUCCESS, baseChannel });
    store.dispatch({
      type: actions.SUBSCRIBE_REQUEST,
      channel: baseChannel,
      subscription: UPDATE_STATE,
    });
    store.dispatch({
      type: actions.SUBSCRIBE_REQUEST,
      channel: 'report',
      subscription: UPDATE_REPORTS,
    });
  });
}

function getReport(reportId: unknown) {
  socket.emit(
    'getReport',
    reportId,
    (error: Error, data: { payload: string }) => {
      if (error) {
        store.dispatch({ type: GET_REPORT_ERROR, error });
        return;
      }
      store.dispatch({ type: GET_REPORT_SUCCESS, data });
      store.dispatch(importState(data.payload));
    }
  );
}

export default function api(
  inStore: MiddlewareAPI<Dispatch<StoreAction>, StoreState>
) {
  store = inStore;
  return (next: Dispatch<StoreAction>) => (action: StoreAction) => {
    const result = next(action);
    switch (action.type) {
      case actions.CONNECT_REQUEST:
        connect();
        break;
      case actions.RECONNECT:
        disconnect();
        if (action.options.type !== 'disabled') connect();
        break;
      case actions.AUTH_REQUEST:
        login();
        break;
      case actions.SUBSCRIBE_REQUEST:
        subscribe(action.channel, action.subscription);
        break;
      case actions.SUBSCRIBE_SUCCESS:
        startMonitoring(action.channel);
        break;
      case actions.EMIT:
        if (socket) emit(action);
        break;
      case LIFTED_ACTION:
        dispatchRemoteAction(action);
        break;
      case GET_REPORT_REQUEST:
        getReport(action.report);
        break;
    }
    return result;
  };
}
