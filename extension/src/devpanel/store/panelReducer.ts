import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { StoreAction, StoreState } from '@redux-devtools/app';
import {
  connection,
  instances,
  monitor,
  notification,
  reports,
  section,
  socket,
  stateTreeSettings,
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
