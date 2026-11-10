import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { InstancesState } from '@redux-devtools/app';
import { instances } from '@redux-devtools/app';
import type { BackgroundAction } from './backgroundStore.js';

export interface BackgroundState {
  readonly instances: InstancesState;
}

const rootReducer: Reducer<
  BackgroundState,
  BackgroundAction,
  Partial<BackgroundState>
> = combineReducers({
  instances,
}) as any;

export default rootReducer;
