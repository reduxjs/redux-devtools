import { UPDATE_STATE, LIFTED_ACTION } from 'remotedev-app/lib/constants/actionTypes';
import { getActiveInstance } from 'remotedev-app/lib/reducers/instances';

const syncStores = baseStore => store => next => action => {
  if (action.type === UPDATE_STATE) {
    return next({
      ...action,
      instances: baseStore.getState().instances
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
