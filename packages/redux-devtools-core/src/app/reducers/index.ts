import { combineReducers } from 'redux';
import section, { SectionState } from './section';
import connection, { ConnectionState } from './connection';
import socket from './socket';
import monitor from './monitor';
import notification, { NotificationState } from './notification';
import instances from './instances';
import reports from './reports';
import theme, { ThemeState } from './theme';
import { StoreAction } from '../actions';

export interface StoreState {
  readonly section: SectionState;
  readonly theme: ThemeState;
  readonly connection: ConnectionState;
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
