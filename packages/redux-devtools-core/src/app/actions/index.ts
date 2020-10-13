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
} from '../constants/actionTypes';
import { RECONNECT } from '../constants/socketActionTypes';

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
  readonly theme: 'default' | 'material';
  readonly scheme: string;
  readonly dark: boolean;
}
interface ChangeThemeData {
  readonly formData: ChangeThemeFormData;
}
interface ChangeThemeAction {
  readonly type: typeof CHANGE_THEME;
  readonly theme: 'default' | 'material';
  readonly scheme: string;
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

export function selectInstance(selected) {
  return { type: SELECT_INSTANCE, selected };
}

export function selectMonitor(monitor) {
  return { type: SELECT_MONITOR, monitor };
}

export function selectMonitorWithState(value, monitorState) {
  return { type: SELECT_MONITOR, monitor: value, monitorState };
}

export function selectMonitorTab(subTabName) {
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

interface ConnectionOptions {
  readonly type: 'disabled' | 'remotedev' | 'custom';
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

export type StoreAction =
  | ChangeSectionAction
  | ChangeThemeAction
  | ExportAction
  | TogglePersistAction
  | ToggleSyncAction
  | ToggleSliderAction
  | ToggleDispatcherAction
  | ReconnectAction
  | ShowNotificationAction
  | ClearNotificationAction;
