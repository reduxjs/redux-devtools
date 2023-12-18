import { Action } from 'redux';
import { DevtoolsInspectorProps } from './DevtoolsInspector';

const UPDATE_MONITOR_STATE =
  '@@redux-devtools-inspector-monitor/UPDATE_MONITOR_STATE';

export interface UpdateMonitorStateAction {
  type: typeof UPDATE_MONITOR_STATE;
  monitorState: Partial<DevtoolsInspectorState>;
}
export function updateMonitorState(
  monitorState: Partial<DevtoolsInspectorState>,
): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, monitorState };
}

export type DevtoolsInspectorAction = UpdateMonitorStateAction;

export interface DevtoolsInspectorState {
  selectedActionId: number | null;
  startActionId: number | null;
  inspectedActionPath: (string | number)[];
  inspectedStatePath: (string | number)[];
  tabName: string;
  searchValue?: string;
}

export const DEFAULT_STATE: DevtoolsInspectorState = {
  selectedActionId: null,
  startActionId: null,
  inspectedActionPath: [],
  inspectedStatePath: [],
  tabName: 'Diff',
};

function reduceUpdateState(
  state: DevtoolsInspectorState,
  action: DevtoolsInspectorAction,
) {
  return action.type === UPDATE_MONITOR_STATE
    ? {
        ...state,
        ...action.monitorState,
      }
    : state;
}

export function reducer<S, A extends Action<string>>(
  props: DevtoolsInspectorProps<S, A>,
  state = DEFAULT_STATE,
  action: DevtoolsInspectorAction,
) {
  return {
    ...reduceUpdateState(state, action),
  };
}
