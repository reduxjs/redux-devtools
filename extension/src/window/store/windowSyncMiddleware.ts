import {
  getActiveInstance,
  LIFTED_ACTION,
  StoreAction,
  StoreState,
  TOGGLE_PERSIST,
  UPDATE_STATE,
} from '@redux-devtools/app';
import { Dispatch, Middleware, Store } from 'redux';
import type { BackgroundState } from '../../background/store/backgroundReducer';
import type { BackgroundAction } from '../../background/store/backgroundStore';

const syncStores =
  (
    baseStore: Store<BackgroundState, BackgroundAction>,
  ): Middleware<{}, StoreState, Dispatch<StoreAction>> =>
  (store) =>
  (next) =>
  (untypedAction) => {
    const action = untypedAction as StoreAction;

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
