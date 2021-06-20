import { combineReducers } from 'redux';
import instances, {
  InstancesState,
} from '@redux-devtools/app/lib/reducers/instances';
import persistStates from './persistStates';

export interface BackgroundState {
  readonly instances: InstancesState;
  readonly persistStates: boolean;
}

const rootReducer = combineReducers({
  instances,
  persistStates,
});

export default rootReducer;
