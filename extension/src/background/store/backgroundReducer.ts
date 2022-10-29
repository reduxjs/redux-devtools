import { combineReducers, Reducer } from 'redux';
import { instances, InstancesState } from '@redux-devtools/app';
import type { BackgroundAction } from './backgroundStore';

export interface BackgroundState {
  readonly instances: InstancesState;
}

const rootReducer: Reducer<BackgroundState, BackgroundAction> =
  combineReducers<BackgroundState>({
    instances,
  });

export default rootReducer;
