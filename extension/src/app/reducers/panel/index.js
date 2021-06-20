import { combineReducers } from 'redux';
import instances from '@redux-devtools/app/lib/reducers/instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import reports from '@redux-devtools/app/lib/reducers/reports';
import section from '@redux-devtools/app/lib/reducers/section';
import theme from '@redux-devtools/app/lib/reducers/theme';

const rootReducer = combineReducers({
  instances,
  monitor,
  reports,
  notification,
  section,
  theme,
});

export default rootReducer;
