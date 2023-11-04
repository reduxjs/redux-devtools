import { Action } from 'redux';
import { ChartMonitorAction, TOGGLE_VISIBILITY } from './actions';
import { ChartMonitorProps } from './ChartMonitor';

function toggleVisibility<S, A extends Action<string>>(
  props: ChartMonitorProps<S, A>,
  state = props.defaultIsVisible,
  action: ChartMonitorAction,
): boolean {
  if (action.type === TOGGLE_VISIBILITY) {
    return !state;
  }

  if (props.defaultIsVisible !== undefined) {
    return props.defaultIsVisible;
  }

  return true;
}

export interface ChartMonitorState {
  isVisible?: boolean;
}

export default function reducer<S, A extends Action<string>>(
  props: ChartMonitorProps<S, A>,
  state: ChartMonitorState | undefined = {},
  action: ChartMonitorAction,
) {
  return {
    isVisible: toggleVisibility(props, state.isVisible, action),
  };
}
