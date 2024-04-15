import { REHYDRATE } from 'redux-persist';
import {
  MONITOR_ACTION,
  SELECT_MONITOR,
  UPDATE_MONITOR_STATE,
  TOGGLE_SLIDER,
  TOGGLE_DISPATCHER,
} from '../constants/actionTypes';
import { MonitorActionAction, CoreStoreAction } from '../actions';

export interface MonitorStateMonitorState {
  inspectedStatePath?: string[];
  tabName?: string;
  subTabName?: string;
  selectedActionId?: number | null;
  startActionId?: number | null;
  inspectedActionPath?: string[];
  __overwritten__?: string;
}
export interface MonitorState {
  selected: string;
  monitorState?: MonitorStateMonitorState | undefined;
  sliderIsOpen: boolean;
  dispatcherIsOpen: boolean;
}

const initialState: MonitorState = {
  selected: 'InspectorMonitor',
  monitorState: undefined,
  sliderIsOpen: true,
  dispatcherIsOpen: false,
};

export function dispatchMonitorAction(
  state: MonitorState,
  action: MonitorActionAction,
): MonitorState {
  return {
    ...state,
    monitorState: (action.action.newMonitorState ||
      action.monitorReducer(
        action.monitorProps,
        state.monitorState,
        action.action,
      )) as MonitorStateMonitorState,
  };
}

export function monitor(
  state = initialState,
  action: CoreStoreAction,
): MonitorState {
  switch (action.type) {
    case MONITOR_ACTION:
      return dispatchMonitorAction(state, action);
    case SELECT_MONITOR: {
      let monitorState = state.monitorState;
      if (action.monitorState) {
        monitorState = {
          ...action.monitorState,
          __overwritten__: action.monitor,
        };
      }
      return {
        ...state,
        monitorState,
        selected: action.monitor,
      };
    }
    case UPDATE_MONITOR_STATE: {
      let inspectedStatePath = state.monitorState!.inspectedStatePath!;
      if (action.nextState.inspectedStatePath) {
        inspectedStatePath = [
          ...inspectedStatePath.slice(0, -1),
          ...action.nextState.inspectedStatePath,
        ];
      }
      return {
        ...state,
        monitorState: {
          ...state.monitorState,
          ...action.nextState,
          inspectedStatePath,
        },
      };
    }
    case TOGGLE_SLIDER:
      return {
        ...state,
        sliderIsOpen: !state.sliderIsOpen,
      };
    case TOGGLE_DISPATCHER:
      return {
        ...state,
        dispatcherIsOpen: !state.dispatcherIsOpen,
      };
    case REHYDRATE: {
      const rehydratedState = action.payload as
        | {
            readonly monitor: MonitorState;
          }
        | undefined;
      if (!rehydratedState) return state;
      if (
        rehydratedState.monitor.monitorState &&
        (typeof rehydratedState.monitor.monitorState.selectedActionId ===
          'number' ||
          typeof rehydratedState.monitor.monitorState.startActionId ===
            'number')
      ) {
        return {
          ...rehydratedState.monitor,
          monitorState: {
            ...rehydratedState.monitor.monitorState,
            selectedActionId: null,
            startActionId: null,
          },
        };
      }
      return rehydratedState.monitor;
    }
    default:
      return state;
  }
}
