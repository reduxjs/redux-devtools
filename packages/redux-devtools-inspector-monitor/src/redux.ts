import { Action } from 'redux';
import { DevtoolsInspectorProps } from './DevtoolsInspector';

const UPDATE_MONITOR_STATE =
  '@@redux-devtools-inspector-monitor/UPDATE_MONITOR_STATE';

const ACTION_FORM_VALUE_CHANGE =
  '@@redux-devtools-inspector-monitor/ACTION_FORM_VALUE_CHANGE';

export interface ActionForm {
  searchValue: string;
  isNoopFilterActive: boolean;
}
export interface UpdateMonitorStateAction {
  type: typeof UPDATE_MONITOR_STATE;
  monitorState: Partial<DevtoolsInspectorState>;
}

export interface ChangeActionFormAction {
  type: typeof ACTION_FORM_VALUE_CHANGE;
  formValues: Partial<ActionForm>;
}

export function updateMonitorState(
  monitorState: Partial<DevtoolsInspectorState>
): UpdateMonitorStateAction {
  return { type: UPDATE_MONITOR_STATE, monitorState };
}

export function changeActionFormValues(
  formValues: Partial<ActionForm>
): ChangeActionFormAction {
  return { type: ACTION_FORM_VALUE_CHANGE, formValues };
}

export type DevtoolsInspectorAction =
  | UpdateMonitorStateAction
  | ChangeActionFormAction;

export interface DevtoolsInspectorState {
  selectedActionId: number | null;
  startActionId: number | null;
  inspectedActionPath: (string | number)[];
  inspectedStatePath: (string | number)[];
  tabName: string;
  actionForm: ActionForm;
}

export const DEFAULT_STATE: DevtoolsInspectorState = {
  selectedActionId: null,
  startActionId: null,
  inspectedActionPath: [],
  inspectedStatePath: [],
  tabName: 'Diff',
  actionForm: {
    searchValue: '',
    isNoopFilterActive: false,
  },
};

function internalMonitorActionReducer(
  state: DevtoolsInspectorState,
  action: DevtoolsInspectorAction
): DevtoolsInspectorState {
  switch (action.type) {
    case UPDATE_MONITOR_STATE:
      return {
        ...state,
        ...action.monitorState,
      };
    case ACTION_FORM_VALUE_CHANGE:
      return {
        ...state,
        actionForm: {
          ...state.actionForm,
          ...action.formValues,
        },
      };
    default:
      return state;
  }
}

export function reducer<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>,
  state = DEFAULT_STATE,
  action: DevtoolsInspectorAction
) {
  return {
    ...internalMonitorActionReducer(state, action),
  };
}
