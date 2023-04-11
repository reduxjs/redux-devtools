import { combineReducers, Reducer } from 'redux';
import {
  connection,
  monitor,
  notification,
  reports,
  section,
  socket,
  theme,
  stateTreeSettings,
  StoreState,
} from '@redux-devtools/app';
import instances from './instancesReducer';
import type { WindowStoreAction } from './windowStore';

const rootReducer: Reducer<StoreState, WindowStoreAction> =
  combineReducers<StoreState>({
    instances,
    monitor,
    socket,
    reports,
    notification,
    section,
    theme,
    connection,
    stateTreeSettings,
  });

export default rootReducer;
