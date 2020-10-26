import { combineReducers } from 'redux';
import instances from 'remotedev-app/lib/reducers/instances';
import persistStates from './persistStates';

const rootReducer = combineReducers({
  instances,
  persistStates
});

export default rootReducer;
