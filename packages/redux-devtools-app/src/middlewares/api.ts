import {
  DispatchAction,
  GET_REPORT_ERROR,
  GET_REPORT_REQUEST,
  GET_REPORT_SUCCESS,
  CLEAR_INSTANCES,
  getActiveInstance,
  importState,
  LIFTED_ACTION,
  LiftedActionAction,
  REMOVE_INSTANCE,
  Request,
  showNotification,
  UPDATE_REPORTS,
  UPDATE_STATE,
  UpdateReportsRequest,
} from '@redux-devtools/app-core';
import socketClusterClient, { AGClientSocket } from 'socketcluster-client';
import { stringify } from 'jsan';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import * as actions from '../constants/socketActionTypes';
import { nonReduxDispatch } from '../utils/monitorActions';
import { EmitAction, StoreAction } from '../actions';
import { StoreState } from '../reducers';

let socket: AGClientSocket;
let store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>;

function emit({ message: type, id, instanceId, action, state }: EmitAction) {
  void socket.transmit(id ? `sc-${id}` : 'respond', {
    type,
    action,
    state,
    instanceId,
  });
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
      instances,
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
    void socket.transmit('respond', {
      type: 'SYNC',
      state: stringify(instances.states[instanceId]),
      id: request.id,
      instanceId,
    });
  }
}

function subscribe(
  channelName: string,
  subscription: typeof UPDATE_STATE | typeof UPDATE_REPORTS,
) {
  const channel = socket.subscribe(channelName);
  if (subscription === UPDATE_STATE) {
    void (async () => {
      for await (const data of channel) {
        monitoring(data as MonitoringRequest);
      }
    })();
  } else {
    const watcher = (request: UpdateReportsRequest) => {
      store.dispatch({ type: subscription, request });
    };
    void (async () => {
      for await (const data of channel) {
        watcher(data as UpdateReportsRequest);
      }
    })();
  }
}

function handleConnection() {
  void (async () => {
    for await (const data of socket.listener('connect')) {
      store.dispatch({
        type: actions.CONNECT_SUCCESS,
        payload: {
          id: data.id,
          authState: socket.authState,
          socketState: socket.state,
        },
        // @ts-expect-error Is this legitimate?
        error: data.authError,
      });
      if (socket.authState !== actions.AUTHENTICATED) {
        store.dispatch({ type: actions.AUTH_REQUEST });
      }
    }
  })();
  void (async () => {
    for await (const data of socket.listener('disconnect')) {
      store.dispatch({ type: actions.DISCONNECTED, code: data.code });
      store.dispatch({ type: CLEAR_INSTANCES });
    }
  })();

  void (async () => {
    for await (const data of socket.listener('subscribe')) {
      store.dispatch({
        type: actions.SUBSCRIBE_SUCCESS,
        channel: data.channel,
      });
    }
  })();
  void (async () => {
    for await (const data of socket.listener('unsubscribe')) {
      void socket.unsubscribe(data.channel);
      store.dispatch({ type: actions.UNSUBSCRIBE, channel: data.channel });
    }
  })();
  void (async () => {
    for await (const data of socket.listener('subscribeFail')) {
      store.dispatch({
        type: actions.SUBSCRIBE_ERROR,
        error: data.error,
        status: 'subscribeFail',
      });
    }
  })();

  void (async () => {
    for await (const data of socket.listener('error')) {
      store.dispatch({ type: actions.CONNECT_ERROR, error: data.error });
    }
  })();
}

function connect() {
  if (process.env.NODE_ENV === 'test') return;
  const connection = store.getState().connection;
  try {
    socket = socketClusterClient.create(connection.options);
    handleConnection();
  } catch (error) {
    store.dispatch({ type: actions.CONNECT_ERROR, error: error as Error });
    store.dispatch(
      showNotification((error as Error).message || (error as string)),
    );
  }
}

function disconnect() {
  if (socket) {
    socket.disconnect();
  }
}

function login() {
  void (async () => {
    try {
      const baseChannel = (await socket.invoke('login', {})) as string;
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
    } catch (error) {
      store.dispatch({ type: actions.AUTH_ERROR, error: error as Error });
    }
  })();
}

function getReport(reportId: unknown) {
  void (async () => {
    try {
      const data = (await socket.invoke('getReport', reportId)) as {
        payload: string;
      };
      store.dispatch({ type: GET_REPORT_SUCCESS, data });
      store.dispatch(importState(data.payload));
    } catch (error) {
      store.dispatch({ type: GET_REPORT_ERROR, error: error as Error });
    }
  })();
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const api: Middleware<{}, StoreState, Dispatch<StoreAction>> = (
  inStore,
) => {
  store = inStore;
  return (next) => (untypedAction) => {
    const result = next(untypedAction);

    const action = untypedAction as StoreAction;
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
};
