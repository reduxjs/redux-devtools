import { combineReducers, Reducer } from 'redux';
import instances, {
  InstancesState,
} from '@redux-devtools/app/lib/reducers/instances';
import persistStates from './persistStates';
import { BackgroundAction } from '../../stores/backgroundStore';

export interface BackgroundState {
  readonly instances: InstancesState;
  readonly persistStates: boolean;
}

const rootReducer: Reducer<BackgroundState, BackgroundAction> =
  combineReducers<BackgroundState>({
    instances,
    persistStates,
  });

export default rootReducer;
