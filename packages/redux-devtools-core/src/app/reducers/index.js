import { combineReducers } from 'redux';
import section from './section';
import connection from './connection';
import socket from './socket';
import monitor from './monitor';
import notification from './notification';
import instances from './instances';
import reports from './reports';
import theme from './theme';

const rootReducer = combineReducers({
  section,
  theme,
  connection,
  socket,
  monitor,
  instances,
  reports,
  notification
});

export default rootReducer;
