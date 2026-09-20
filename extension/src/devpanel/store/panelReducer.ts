import { combineReducers, Reducer } from 'redux';
import {
  connection,
  instances,
  monitor,
  notification,
  reports,
  section,
  socket,
  stateTreeSettings,
  StoreAction,
  StoreState,
  theme,
} from '@redux-devtools/app';

const rootReducer: Reducer<
  StoreState,
  StoreAction,
  Partial<StoreState>
> = combineReducers({
  instances,
  monitor,
  reports,
  notification,
  section,
  socket,
  theme,
  connection,
  stateTreeSettings,
}) as any;

export default rootReducer;
