import { combineReducers, Reducer } from 'redux';
import { instances, InstancesState } from '@redux-devtools/app';
import { BackgroundAction } from './backgroundStore';

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
