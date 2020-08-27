import { Action } from 'redux';
import {
  UPDATE_SCROLL_TOP,
  START_CONSECUTIVE_TOGGLE,
  LogMonitorAction,
} from './actions';
import { LogMonitorProps } from './LogMonitor';

function initialScrollTop<S, A extends Action<unknown>>(
  props: LogMonitorProps<S, A>,
  state = 0,
  action: LogMonitorAction
) {
  if (!props.preserveScrollTop) {
    return 0;
  }

  return action.type === UPDATE_SCROLL_TOP ? action.scrollTop : state;
}

function startConsecutiveToggle<S, A extends Action<unknown>>(
  props: LogMonitorProps<S, A>,
  state: number | null | undefined,
  action: LogMonitorAction
) {
  return action.type === START_CONSECUTIVE_TOGGLE ? action.id : state;
}

export interface LogMonitorState {
  initialScrollTop: number;
  consecutiveToggleStartId: number | null | undefined;
}

export default function reducer<S, A extends Action<unknown>>(
  props: LogMonitorProps<S, A>,
  state: Partial<LogMonitorState> = {},
  action: LogMonitorAction
): LogMonitorState {
  return {
    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action),
    consecutiveToggleStartId: startConsecutiveToggle(
      props,
      state.consecutiveToggleStartId,
      action
    ),
  };
}
