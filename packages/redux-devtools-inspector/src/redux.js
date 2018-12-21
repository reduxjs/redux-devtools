const UPDATE_MONITOR_STATE = '@@redux-devtools-inspector/UPDATE_MONITOR_STATE';

export const DEFAULT_STATE = {
  selectedActionId: null,
  startActionId: null,
  inspectedActionPath: [],
  inspectedStatePath: [],
  tabName: 'Diff'
};

export function updateMonitorState(monitorState) {
  return { type: UPDATE_MONITOR_STATE, monitorState };
}

function reduceUpdateState(state, action) {
  return (action.type === UPDATE_MONITOR_STATE) ? {
    ...state,
    ...action.monitorState
  } : state;
}

export function reducer(props, state=DEFAULT_STATE, action) {
  return {
    ...reduceUpdateState(state, action)
  };
}
