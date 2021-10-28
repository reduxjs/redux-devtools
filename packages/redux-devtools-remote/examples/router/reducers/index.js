import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import todos from './todos';

const rootReducer = combineReducers({
  todos,
  router: routerStateReducer
});

export default rootReducer;
