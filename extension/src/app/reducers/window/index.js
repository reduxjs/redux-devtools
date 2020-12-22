import { combineReducers } from 'redux';
import instances from './instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import socket from '@redux-devtools/app/lib/reducers/socket';
import reports from '@redux-devtools/app/lib/reducers/reports';
import test from '@redux-devtools/app/lib/reducers/test';

const rootReducer = combineReducers({
  instances,
  monitor,
  test,
  socket,
  reports,
  notification,
});

export default rootReducer;
