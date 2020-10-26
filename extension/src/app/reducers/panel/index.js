import { combineReducers } from 'redux';
import instances from 'remotedev-app/lib/reducers/instances';
import monitor from 'remotedev-app/lib/reducers/monitor';
import notification from 'remotedev-app/lib/reducers/notification';
import test from 'remotedev-app/lib/reducers/test';
import reports from 'remotedev-app/lib/reducers/reports';

const rootReducer = combineReducers({
  instances,
  monitor,
  test,
  reports,
  notification
});

export default rootReducer;
