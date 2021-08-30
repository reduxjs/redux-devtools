import { combineReducers, Reducer } from 'redux';
import instances, {
  InstancesState,
} from '@redux-devtools/app/lib/reducers/instances';
import monitor, {
  MonitorState,
} from '@redux-devtools/app/lib/reducers/monitor';
import notification, {
  NotificationState,
} from '@redux-devtools/app/lib/reducers/notification';
import reports, {
  ReportsState,
} from '@redux-devtools/app/lib/reducers/reports';
import section, {
  SectionState,
} from '@redux-devtools/app/lib/reducers/section';
import theme, { ThemeState } from '@redux-devtools/app/lib/reducers/theme';
import connection, {
  ConnectionState,
} from '@redux-devtools/app/lib/reducers/connection';
import { StoreAction } from '@redux-devtools/app/lib/actions';

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
