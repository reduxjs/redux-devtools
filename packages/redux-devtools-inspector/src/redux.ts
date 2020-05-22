import { Action } from 'redux';
import { Props } from './DevtoolsInspector';

const UPDATE_MONITOR_STATE = '@@redux-devtools-inspector/UPDATE_MONITOR_STATE';
interface UpdateMonitorStateAction {
  type: typeof UPDATE_MONITOR_STATE;
  monitorState: Partial<MonitorState>;
}

export type MonitorAction = UpdateMonitorStateAction;

export interface MonitorState {
  readonly selectedActionId: number | null;
  readonly startActionId: number | null;
  readonly inspectedActionPath: (string | number)[];
  readonly inspectedStatePath: (string | number)[];
  readonly tabName: string;
  readonly searchValue?: string;
}

export const DEFAULT_STATE: MonitorState = {
  selectedActionId: null,
  startActionId: null,
  inspectedActionPath: [],
  inspectedStatePath: [],
  tabName: 'Diff'
};

export function updateMonitorState(
  monitorState: Partial<MonitorState>
): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, monitorState };
}

function reduceUpdateState(state: MonitorState, action: MonitorAction) {
  return action.type === UPDATE_MONITOR_STATE
    ? {
        ...state,
        ...action.monitorState
      }
    : state;
}

export function reducer<S, A extends Action<unknown>>(
  props: Props<S, A>,
  state = DEFAULT_STATE,
  action: MonitorAction
) {
  return {
    ...reduceUpdateState(state, action)
  };
}
