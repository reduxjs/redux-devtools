import {
  UPDATE_STATE,
  LIFTED_ACTION,
} from '@redux-devtools/app/lib/constants/actionTypes';
import { getActiveInstance } from '@redux-devtools/app/lib/reducers/instances';
import { Dispatch, MiddlewareAPI, Store } from 'redux';
import { BackgroundState } from '../reducers/background';
import { StoreAction } from '@redux-devtools/app/lib/actions';

const syncStores =
  (baseStore: Store<BackgroundState, StoreAction>) =>
  (store: MiddlewareAPI<Dispatch<StoreAction>>) =>
  (next: Dispatch<StoreAction>) =>
  (action: StoreAction) => {
    if (action.type === UPDATE_STATE) {
      return next({
        ...action,
        instances: baseStore.getState().instances,
      });
    }
    if (action.type === LIFTED_ACTION || action.type === 'TOGGLE_PERSIST') {
      const instances = store.getState().instances;
      const instanceId = getActiveInstance(instances);
      const id = instances.options[instanceId].connectionId;
      baseStore.dispatch({ ...action, instanceId, id });
    }
    return next(action);
  };

export default syncStores;
