import {
  UPDATE_STATE,
  LIFTED_ACTION,
  TOGGLE_PERSIST,
} from '@redux-devtools/app/lib/constants/actionTypes';
import { getActiveInstance } from '@redux-devtools/app/lib/reducers/instances';
import { Dispatch, MiddlewareAPI, Store } from 'redux';
import { BackgroundState } from '../reducers/background';
import { StoreAction } from '@redux-devtools/app/lib/actions';
import { WindowStoreAction } from '../stores/windowStore';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import { BackgroundAction } from '../stores/backgroundStore';

const syncStores =
  (baseStore: Store<BackgroundState, BackgroundAction>) =>
  (store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>) =>
  (next: Dispatch<WindowStoreAction>) =>
  (action: StoreAction) => {
    if (action.type === UPDATE_STATE) {
      return next({
        ...action,
        instances: baseStore.getState().instances,
      });
    }
    if (action.type === LIFTED_ACTION || action.type === TOGGLE_PERSIST) {
      const instances = store.getState().instances;
      const instanceId = getActiveInstance(instances);
      const id = instances.options[instanceId].connectionId;
      baseStore.dispatch({ ...action, instanceId, id } as any);
    }
    return next(action);
  };

export default syncStores;
