export const TOGGLE_VISIBILITY =
  '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
interface ToggleVisibilityAction {
  type: typeof TOGGLE_VISIBILITY;
}
export function toggleVisibility(): ToggleVisibilityAction {
  return { type: TOGGLE_VISIBILITY };
}

export const CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
interface ChangePositionAction {
  type: typeof CHANGE_POSITION;
}
export function changePosition(): ChangePositionAction {
  return { type: CHANGE_POSITION };
}

export const CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
interface ChangeSizeAction {
  type: typeof CHANGE_SIZE;
  size: number;
}
export function changeSize(size: number): ChangeSizeAction {
  return { type: CHANGE_SIZE, size: size };
}

export const CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
interface ChangeMonitorAction {
  type: typeof CHANGE_MONITOR;
}
export function changeMonitor(): ChangeMonitorAction {
  return { type: CHANGE_MONITOR };
}

export type DockMonitorAction =
  | ToggleVisibilityAction
  | ChangePositionAction
  | ChangeSizeAction
  | ChangeMonitorAction;
