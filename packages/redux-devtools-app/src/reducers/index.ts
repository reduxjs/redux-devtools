import { combineReducers } from 'redux';
import { section, SectionState } from './section';
import { connection, ConnectionState } from './connection';
import { socket, SocketState } from './socket';
import { monitor, MonitorState } from './monitor';
import { notification, NotificationState } from './notification';
import { instances, InstancesState } from './instances';
import { reports, ReportsState } from './reports';
import { theme, ThemeState } from './theme';
import { StoreAction } from '../actions';
import { stateTreeSettings, StateTreeSettings } from './stateTreeSettings';

export interface StoreState {
  readonly section: SectionState;
  readonly theme: ThemeState;
  readonly stateTreeSettings: StateTreeSettings;
  readonly connection: ConnectionState;
  readonly socket: SocketState;
  readonly monitor: MonitorState;
  readonly instances: InstancesState;
  readonly reports: ReportsState;
  readonly notification: NotificationState;
}

export const rootReducer = combineReducers<StoreState, StoreAction>({
  section,
  theme,
  stateTreeSettings,
  connection,
  socket,
  monitor,
  instances,
  reports,
  notification,
});
