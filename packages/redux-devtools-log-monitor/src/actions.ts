export const UPDATE_SCROLL_TOP =
  '@@redux-devtools-log-monitor/UPDATE_SCROLL_TOP';
interface UpdateScrollTopAction {
  type: typeof UPDATE_SCROLL_TOP;
  scrollTop: number;
}
export function updateScrollTop(scrollTop: number): UpdateScrollTopAction {
  return { type: UPDATE_SCROLL_TOP, scrollTop };
}

export const START_CONSECUTIVE_TOGGLE =
  '@@redux-devtools-log-monitor/START_CONSECUTIVE_TOGGLE';
interface StartConsecutiveToggleAction {
  type: typeof START_CONSECUTIVE_TOGGLE;
  id: number | null;
}
export function startConsecutiveToggle(
  id: number | null,
): StartConsecutiveToggleAction {
  return { type: START_CONSECUTIVE_TOGGLE, id };
}

export type LogMonitorAction =
  | UpdateScrollTopAction
  | StartConsecutiveToggleAction;
