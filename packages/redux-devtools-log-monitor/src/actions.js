export const UPDATE_SCROLL_TOP = '@@redux-devtools-log-monitor/UPDATE_SCROLL_TOP';
export function updateScrollTop(scrollTop) {
  return { type: UPDATE_SCROLL_TOP, scrollTop };
}

export const START_CONSECUTIVE_TOGGLE = '@@redux-devtools-log-monitor/START_CONSECUTIVE_TOGGLE';
export function startConsecutiveToggle(id) {
  return { type: START_CONSECUTIVE_TOGGLE, id };
}
