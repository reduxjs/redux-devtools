import { combineReducers } from 'redux';
import section, { SectionState } from './section';
import connection, { ConnectionState } from './connection';
import socket, { SocketState } from './socket';
import monitor, { MonitorState } from './monitor';
import notification, { NotificationState } from './notification';
import instances, { InstancesState } from './instances';
import reports, { ReportsState } from './reports';
import theme, { ThemeState } from './theme';
import { StoreAction } from '../actions';

export interface StoreState {
  readonly section: SectionState;
  readonly theme: ThemeState;
  readonly connection: ConnectionState;
  readonly socket: SocketState;
  readonly monitor: MonitorState;
  readonly instances: InstancesState;
  readonly reports: ReportsState;
  readonly notification: NotificationState;
}

const rootReducer = combineReducers<StoreState, StoreAction>({
  section,
  theme,
  connection,
  socket,
  monitor,
  instances,
  reports,
  notification,
});

export default rootReducer;
