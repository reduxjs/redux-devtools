import { combineReducers, Reducer } from 'redux';
import {
  connection,
  ConnectionState,
  instances,
  InstancesState,
  monitor,
  MonitorState,
  notification,
  NotificationState,
  reports,
  ReportsState,
  section,
  SectionState,
  StateTreeSettings,
  stateTreeSettings,
  StoreAction,
  theme,
  ThemeState,
} from '@redux-devtools/app';

export interface StoreStateWithoutSocket {
  readonly section: SectionState;
  readonly theme: ThemeState;
  readonly connection: ConnectionState;
  readonly monitor: MonitorState;
  readonly instances: InstancesState;
  readonly reports: ReportsState;
  readonly notification: NotificationState;
  readonly stateTreeSettings: StateTreeSettings;
}

const rootReducer: Reducer<
  StoreStateWithoutSocket,
  StoreAction,
  Partial<StoreStateWithoutSocket>
> = combineReducers({
  instances,
  monitor,
  reports,
  notification,
  section,
  theme,
  connection,
  stateTreeSettings,
}) as any;

export default rootReducer;
