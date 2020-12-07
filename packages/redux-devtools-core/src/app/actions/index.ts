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
  SET_STATE,
  GET_REPORT_ERROR,
  GET_REPORT_SUCCESS,
  ERROR,
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
  EMIT,
  RECONNECT,
  SUBSCRIBE_ERROR,
  SUBSCRIBE_REQUEST,
  SUBSCRIBE_SUCCESS,
  UNSUBSCRIBE,
} from '../constants/socketActionTypes';
import { Action } from 'redux';
import { Features, State } from '../reducers/instances';
import { MonitorStateMonitorState } from '../reducers/monitor';
import { LiftedAction } from 'redux-devtools-instrument';
import { Data } from '../reducers/reports';

let monitorReducer: (
  monitorProps: unknown,
  state: unknown | undefined,
  action: Action<unknown>
) => unknown;
let monitorProps: unknown = {};

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

export interface InitMonitorAction {
  type: '@@INIT_MONITOR';
  newMonitorState: unknown;
  update: (
    monitorProps: unknown,
    state: unknown | undefined,
    action: Action<unknown>
  ) => unknown;
  monitorProps: unknown;
}
export interface MonitorActionAction {
  type: typeof MONITOR_ACTION;
  action: InitMonitorAction;
  monitorReducer: (
    monitorProps: unknown,
    state: unknown | undefined,
    action: Action<unknown>
  ) => unknown;
  monitorProps: unknown;
}
export interface JumpToStateAction {
  type: 'JUMP_TO_STATE';
  index: number;
  actionId: number;
}
export interface JumpToActionAction {
  type: 'JUMP_TO_ACTION';
  index: number;
  actionId: number;
}
export interface PauseRecordingAction {
  type: 'PAUSE_RECORDING';
  status: boolean;
}
export interface LockChangesAction {
  type: 'LOCK_CHANGES';
  status: boolean;
}
export interface ToggleActionAction {
  type: 'TOGGLE_ACTION';
}
export interface RollbackAction {
  type: 'ROLLBACK';
}
export interface SweepAction {
  type: 'SWEEP';
}
export type DispatchAction =
  | JumpToStateAction
  | JumpToActionAction
  | PauseRecordingAction
  | LockChangesAction
  | ToggleActionAction
  | RollbackAction
  | SweepAction;
interface LiftedActionActionBase {
  action?: DispatchAction | string | CustomAction;
  state?: string;
  toAll?: boolean;
}
export interface LiftedActionDispatchAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'DISPATCH';
  action: DispatchAction;
  toAll?: boolean;
}
interface LiftedActionImportAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'IMPORT';
  state: string;
  preloadedState: unknown | undefined;
}
interface LiftedActionActionAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'ACTION';
  action: string | CustomAction;
}
interface LiftedActionExportAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'EXPORT';
  toExport: boolean;
}
export type LiftedActionAction =
  | LiftedActionDispatchAction
  | LiftedActionImportAction
  | LiftedActionActionAction
  | LiftedActionExportAction;
export function liftedDispatch(
  action:
    | InitMonitorAction
    | JumpToStateAction
    | JumpToActionAction
    | LiftedAction<unknown, Action<unknown>, unknown>
): MonitorActionAction | LiftedActionDispatchAction {
  if (action.type[0] === '@') {
    if (action.type === '@@INIT_MONITOR') {
      monitorReducer = action.update;
      monitorProps = action.monitorProps;
    }
    return {
      type: MONITOR_ACTION,
      action,
      monitorReducer,
      monitorProps,
    } as MonitorActionAction;
  }
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action,
  } as LiftedActionDispatchAction;
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
  monitorState?: MonitorStateMonitorState;
}
export function selectMonitor(monitor: string): SelectMonitorAction {
  return { type: SELECT_MONITOR, monitor };
}
export function selectMonitorWithState(
  value: string,
  monitorState: MonitorStateMonitorState
): SelectMonitorAction {
  return { type: SELECT_MONITOR, monitor: value, monitorState };
}

interface NextState {
  subTabName: string;
  inspectedStatePath?: string[];
}
interface UpdateMonitorStateAction {
  type: typeof UPDATE_MONITOR_STATE;
  nextState: NextState;
}
export function selectMonitorTab(subTabName: string): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, nextState: { subTabName } };
}

export function updateMonitorState(
  nextState: NextState
): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, nextState };
}

export function importState(
  state: string,
  preloadedState?: unknown
): LiftedActionImportAction {
  return { type: LIFTED_ACTION, message: 'IMPORT', state, preloadedState };
}

interface ExportAction {
  type: typeof EXPORT;
}
export function exportState(): ExportAction {
  return { type: EXPORT };
}

export function lockChanges(status: boolean): LiftedActionDispatchAction {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'LOCK_CHANGES', status },
    toAll: true,
  };
}

export function pauseRecording(status: boolean): LiftedActionDispatchAction {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'PAUSE_RECORDING', status },
    toAll: true,
  };
}

export interface CustomAction {
  name: string;
  selected: number;
  args: (string | undefined)[];
  rest: string;
}
export function dispatchRemotely(
  action: string | CustomAction
): LiftedActionActionAction {
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
export interface ConnectionOptions {
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

interface GetReportRequest {
  readonly type: typeof GET_REPORT_REQUEST;
  readonly report: unknown;
}
export function getReport(report: unknown): GetReportRequest {
  return { type: GET_REPORT_REQUEST, report };
}

export interface ActionCreator {
  args: string[];
  name: string;
}

interface LibConfig {
  actionCreators?: string;
  name?: string;
  type?: string;
  features?: Features;
  serialize?: boolean;
}

export interface RequestBase {
  id: string;
  instanceId?: string;
  action?: string;
  name?: string;
  libConfig?: LibConfig;
  actionsById?: string;
  computedStates?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  payload?: {} | string;
  liftedState?: Partial<State>;
}
interface InitRequest extends RequestBase {
  type: 'INIT';
  action: string;
}
interface ActionRequest extends RequestBase {
  type: 'ACTION';
  isExcess: boolean;
  nextActionId: number;
  maxAge: number;
  batched: boolean;
}
interface StateRequest extends RequestBase {
  type: 'STATE';
  committedState: unknown;
}
interface PartialStateRequest extends RequestBase {
  type: 'PARTIAL_STATE';
  committedState: unknown;
  maxAge: number;
}
interface LiftedRequest extends RequestBase {
  type: 'LIFTED';
}
export interface ExportRequest extends RequestBase {
  type: 'EXPORT';
  committedState: unknown;
}
export type Request =
  | InitRequest
  | ActionRequest
  | StateRequest
  | PartialStateRequest
  | LiftedRequest
  | ExportRequest;

interface UpdateStateAction {
  type: typeof UPDATE_STATE;
  request?: Request;
  id?: string;
}

interface SetStateAction {
  type: typeof SET_STATE;
  newState: State;
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

export interface EmitAction {
  type: typeof EMIT;
  message: string;
  id?: string | false;
  instanceId?: string;
  action?: unknown;
  state?: unknown;
}

interface ListRequest {
  type: 'list';
  data: Data[];
}
interface AddRequest {
  type: 'add';
  data: Data;
}
interface RemoveRequest {
  type: 'remove';
  data: Data;
  id: unknown;
}
export type UpdateReportsRequest = ListRequest | AddRequest | RemoveRequest;
interface UpdateReportsAction {
  type: typeof UPDATE_REPORTS;
  request: UpdateReportsRequest;
}

interface GetReportError {
  type: typeof GET_REPORT_ERROR;
  error: Error;
}

interface GetReportSuccess {
  type: typeof GET_REPORT_SUCCESS;
  data: { payload: string };
}

interface ErrorAction {
  type: typeof ERROR;
  payload: string;
}

export type StoreAction =
  | ChangeSectionAction
  | ChangeThemeAction
  | MonitorActionAction
  | LiftedActionAction
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
  | GetReportRequest
  | SetStateAction
  | UpdateStateAction
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
  | UnsubscribeAction
  | EmitAction
  | UpdateReportsAction
  | GetReportError
  | GetReportSuccess
  | ErrorAction;
