import {
  CHANGE_SECTION, CHANGE_THEME, SELECT_INSTANCE, SELECT_MONITOR, UPDATE_MONITOR_STATE,
  LIFTED_ACTION, MONITOR_ACTION, EXPORT, TOGGLE_SYNC, TOGGLE_SLIDER, TOGGLE_DISPATCHER,
  TOGGLE_PERSIST, GET_REPORT_REQUEST, SHOW_NOTIFICATION, CLEAR_NOTIFICATION
} from '../constants/actionTypes';
import { RECONNECT } from '../constants/socketActionTypes';

let monitorReducer;
let monitorProps = {};

export function changeSection(section) {
  return { type: CHANGE_SECTION, section };
}

export function changeTheme(data) {
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

export function exportState() {
  return { type: EXPORT };
}

export function lockChanges(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'LOCK_CHANGES', status },
    toAll: true
  };
}

export function pauseRecording(status) {
  return {
    type: LIFTED_ACTION,
    message: 'DISPATCH',
    action: { type: 'PAUSE_RECORDING', status },
    toAll: true
  };
}

export function dispatchRemotely(action) {
  return { type: LIFTED_ACTION, message: 'ACTION', action };
}

export function togglePersist() {
  return { type: TOGGLE_PERSIST };
}

export function toggleSync() {
  return { type: TOGGLE_SYNC };
}

export function toggleSlider() {
  return { type: TOGGLE_SLIDER };
}

export function toggleDispatcher() {
  return { type: TOGGLE_DISPATCHER };
}

export function saveSocketSettings(options) {
  return { type: RECONNECT, options };
}

export function showNotification(message) {
  return { type: SHOW_NOTIFICATION, notification: { type: 'error', message } };
}

export function clearNotification() {
  return { type: CLEAR_NOTIFICATION };
}

export function getReport(report) {
  return { type: GET_REPORT_REQUEST, report };
}
