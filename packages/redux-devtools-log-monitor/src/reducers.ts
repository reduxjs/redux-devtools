import { Action } from 'redux';
import {
  UPDATE_SCROLL_TOP,
  START_CONSECUTIVE_TOGGLE,
  LogMonitorAction
} from './actions';
import { Props } from './LogMonitor';

function initialScrollTop<S, A extends Action>(
  props: Props<S, A>,
  state: number | undefined = 0,
  action: LogMonitorAction
) {
  if (!props.preserveScrollTop) {
    return 0;
  }

  return action.type === UPDATE_SCROLL_TOP ? action.scrollTop : state;
}

function startConsecutiveToggle<S, A extends Action>(
  props: Props<S, A>,
  state: number | undefined | null,
  action: LogMonitorAction
) {
  return action.type === START_CONSECUTIVE_TOGGLE ? action.id : state;
}

interface InitialLogMonitorState {
  initialScrollTop?: number;
  consecutiveToggleStartId?: number | null;
}

export interface LogMonitorState {
  initialScrollTop: number;
  consecutiveToggleStartId?: number | null;
}

export default function reducer<S, A extends Action>(
  props: Props<S, A>,
  state: InitialLogMonitorState = {},
  action: LogMonitorAction
): LogMonitorState {
  return {
    initialScrollTop: initialScrollTop(props, state.initialScrollTop, action),
    consecutiveToggleStartId: startConsecutiveToggle(
      props,
      state.consecutiveToggleStartId,
      action
    )
  };
}
