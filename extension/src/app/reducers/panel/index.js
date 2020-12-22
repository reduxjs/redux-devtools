import { combineReducers } from 'redux';
import instances from '@redux-devtools/app/lib/reducers/instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import test from '@redux-devtools/app/lib/reducers/test';
import reports from '@redux-devtools/app/lib/reducers/reports';

const rootReducer = combineReducers({
  instances,
  monitor,
  test,
  reports,
  notification,
});

export default rootReducer;
