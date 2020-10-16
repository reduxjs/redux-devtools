import { Scheme, Theme } from 'devui';
import { AuthStates, States } from 'socketcluster-client/lib/scclientsocket';
import {
  CHANGE_SECTION,
  CHANGE_THEME,
  SELECT_INSTANCE,
  SELECT_MONITOR,
  UPDATE_MONITOR_STATE,
  LIFTED_ACTION,
  MONITOR_ACTION,
  EXPORT,
  TOGGLE_SYNC,
  TOGGLE_SLIDER,
  TOGGLE_DISPATCHER,
  TOGGLE_PERSIST,
  GET_REPORT_REQUEST,
  SHOW_NOTIFICATION,
  CLEAR_NOTIFICATION,
  UPDATE_STATE,
  UPDATE_REPORTS,
  REMOVE_INSTANCE,
} from '../constants/actionTypes';
import {
  AUTH_ERROR,
  AUTH_REQUEST,
  AUTH_SUCCESS,
  CONNECT_ERROR,
  CONNECT_REQUEST,
  CONNECT_SUCCESS,
  DEAUTHENTICATE,
  DISCONNECTED,
  RECONNECT,
  SUBSCRIBE_ERROR,
  SUBSCRIBE_REQUEST,
  SUBSCRIBE_SUCCESS,
  UNSUBSCRIBE,
} from '../constants/socketActionTypes';

let monitorReducer;
let monitorProps = {};

interface ChangeSectionAction {
  readonly type: typeof CHANGE_SECTION;
  readonly section: string;
}
export function changeSection(section: string): ChangeSectionAction {
  return { type: CHANGE_SECTION, section };
}

interface ChangeThemeFormData {
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly dark: boolean;
}
interface ChangeThemeData {
  readonly formData: ChangeThemeFormData;
}
interface ChangeThemeAction {
  readonly type: typeof CHANGE_THEME;
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly dark: boolean;
}
export function changeTheme(data: ChangeThemeData): ChangeThemeAction {
  return { type: CHANGE_THEME, ...data.formData };
}

export function liftedDispatch(action) {
  if (action.type[0] === '@') {
    if (action.type === '@@INIT_MONITOR') {
      monitorReducer = action.update;
      monitorProps = action.monitorProps;
    }
    return { type: MONITOR_ACTION, action, monitorReducer, monitorProps };
  }
  return { type: LIFTED_ACTION, message: 'DISPATCH', action };
}

interface SelectInstanceAction {
  type: typeof SELECT_INSTANCE;
  selected: string;
}
export function selectInstance(selected: string): SelectInstanceAction {
  return { type: SELECT_INSTANCE, selected };
}

interface SelectMonitorAction {
  type: typeof SELECT_MONITOR;
  monitor: string;
  monitorState?: unknown;
}
export function selectMonitor(monitor: string): SelectMonitorAction {
  return { type: SELECT_MONITOR, monitor };
}
export function selectMonitorWithState(
  value: string,
  monitorState: unknown
): SelectMonitorAction {
  return { type: SELECT_MONITOR, monitor: value, monitorState };
}

interface NextState {
  subTabName: string;
}
interface UpdateMonitorStateAction {
  type: typeof UPDATE_MONITOR_STATE;
  nextState: NextState;
}
export function selectMonitorTab(subTabName: string): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, nextState: { subTabName } };
}

export function updateMonitorState(nextState) {
  return { type: UPDATE_MONITOR_STATE, nextState };
}

export function importState(state, preloadedState) {
  return { type: LIFTED_ACTION, message: 'IMPORT', state, preloadedState };
}

interface ExportAction {
  type: typeof EXPORT;
}
export function exportState(): ExportAction {
  return { type: EXPORT };
}

export function lockChanges(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'LOCK_CHANGES', status },
    toAll: true,
  };
}

export function pauseRecording(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'PAUSE_RECORDING', status },
    toAll: true,
  };
}

export function dispatchRemotely(action) {
  return { type: LIFTED_ACTION, message: 'ACTION', action };
}

interface TogglePersistAction {
  type: typeof TOGGLE_PERSIST;
}
export function togglePersist(): TogglePersistAction {
  return { type: TOGGLE_PERSIST };
}

interface ToggleSyncAction {
  type: typeof TOGGLE_SYNC;
}
export function toggleSync(): ToggleSyncAction {
  return { type: TOGGLE_SYNC };
}

interface ToggleSliderAction {
  type: typeof TOGGLE_SLIDER;
}
export function toggleSlider(): ToggleSliderAction {
  return { type: TOGGLE_SLIDER };
}

interface ToggleDispatcherAction {
  type: typeof TOGGLE_DISPATCHER;
}
export function toggleDispatcher(): ToggleDispatcherAction {
  return { type: TOGGLE_DISPATCHER };
}

export type ConnectionType = 'disabled' | 'remotedev' | 'custom';
interface ConnectionOptions {
  readonly type: ConnectionType;
  readonly hostname: string;
  readonly port: number;
  readonly secure: boolean;
}
interface ReconnectAction {
  readonly type: typeof RECONNECT;
  readonly options: ConnectionOptions;
}
export function saveSocketSettings(
  options: ConnectionOptions
): ReconnectAction {
  return { type: RECONNECT, options };
}

interface Notification {
  readonly type: 'error';
  readonly message: string;
}
interface ShowNotificationAction {
  readonly type: typeof SHOW_NOTIFICATION;
  readonly notification: Notification;
}
export function showNotification(message: string): ShowNotificationAction {
  return { type: SHOW_NOTIFICATION, notification: { type: 'error', message } };
}

interface ClearNotificationAction {
  readonly type: typeof CLEAR_NOTIFICATION;
}
export function clearNotification(): ClearNotificationAction {
  return { type: CLEAR_NOTIFICATION };
}

export function getReport(report) {
  return { type: GET_REPORT_REQUEST, report };
}

interface RemoveInstanceAction {
  type: typeof REMOVE_INSTANCE;
  id: string;
}

interface ConnectRequestAction {
  type: typeof CONNECT_REQUEST;
  options: ConnectionOptions;
}

interface ConnectSuccessPayload {
  id: string;
  authState: AuthStates;
  socketState: States;
}
interface ConnectSuccessAction {
  type: typeof CONNECT_SUCCESS;
  payload: ConnectSuccessPayload;
  error: Error | undefined;
}

interface ConnectErrorAction {
  type: typeof CONNECT_ERROR;
  error: Error | undefined;
}

interface AuthRequestAction {
  type: typeof AUTH_REQUEST;
}

interface AuthSuccessAction {
  type: typeof AUTH_SUCCESS;
  baseChannel: string;
}

interface AuthErrorAction {
  type: typeof AUTH_ERROR;
  error: Error;
}

interface DisconnectedAction {
  type: typeof DISCONNECTED;
  code: number;
}

interface DeauthenticateAction {
  type: typeof DEAUTHENTICATE;
}

interface SubscribeRequestAction {
  type: typeof SUBSCRIBE_REQUEST;
  channel: string;
  subscription: typeof UPDATE_STATE | typeof UPDATE_REPORTS;
}

interface SubscribeSuccessAction {
  type: typeof SUBSCRIBE_SUCCESS;
  channel: string;
}

interface SubscribeErrorAction {
  type: typeof SUBSCRIBE_ERROR;
  error: Error;
  status: string;
}

interface UnsubscribeAction {
  type: typeof UNSUBSCRIBE;
  channel: string;
}

export type StoreAction =
  | ChangeSectionAction
  | ChangeThemeAction
  | SelectInstanceAction
  | SelectMonitorAction
  | UpdateMonitorStateAction
  | ExportAction
  | TogglePersistAction
  | ToggleSyncAction
  | ToggleSliderAction
  | ToggleDispatcherAction
  | ReconnectAction
  | ShowNotificationAction
  | ClearNotificationAction
  | RemoveInstanceAction
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
  | UnsubscribeAction;
