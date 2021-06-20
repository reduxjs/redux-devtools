import { combineReducers } from 'redux';
import instances from './instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import socket from '@redux-devtools/app/lib/reducers/socket';
import reports from '@redux-devtools/app/lib/reducers/reports';
import section from '@redux-devtools/app/lib/reducers/section';
import theme from '@redux-devtools/app/lib/reducers/theme';

const rootReducer = combineReducers({
  instances,
  monitor,
  socket,
  reports,
  notification,
  section,
  theme,
});

export default rootReducer;
