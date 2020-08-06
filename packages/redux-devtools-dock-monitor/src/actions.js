export const TOGGLE_VISIBILITY =
  '@@redux-devtools-log-monitor/TOGGLE_VISIBILITY';
export function toggleVisibility() {
  return { type: TOGGLE_VISIBILITY };
}

export const CHANGE_POSITION = '@@redux-devtools-log-monitor/CHANGE_POSITION';
export function changePosition() {
  return { type: CHANGE_POSITION };
}

export const CHANGE_SIZE = '@@redux-devtools-log-monitor/CHANGE_SIZE';
export function changeSize(size) {
  return { type: CHANGE_SIZE, size: size };
}

export const CHANGE_MONITOR = '@@redux-devtools-log-monitor/CHANGE_MONITOR';
export function changeMonitor() {
  return { type: CHANGE_MONITOR };
}
