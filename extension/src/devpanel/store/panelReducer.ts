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
}

const rootReducer: Reducer<StoreStateWithoutSocket, StoreAction> =
  combineReducers<StoreStateWithoutSocket>({
    instances,
    monitor,
    reports,
    notification,
    section,
    theme,
    connection,
  });

export default rootReducer;
