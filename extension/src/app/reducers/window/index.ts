import { combineReducers, Reducer } from 'redux';
import instances from './instances';
import monitor from '@redux-devtools/app/lib/reducers/monitor';
import notification from '@redux-devtools/app/lib/reducers/notification';
import socket from '@redux-devtools/app/lib/reducers/socket';
import reports from '@redux-devtools/app/lib/reducers/reports';
import section from '@redux-devtools/app/lib/reducers/section';
import theme from '@redux-devtools/app/lib/reducers/theme';
import connection from '@redux-devtools/app/lib/reducers/connection';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import { WindowStoreAction } from '../../stores/windowStore';

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
  });

export default rootReducer;
