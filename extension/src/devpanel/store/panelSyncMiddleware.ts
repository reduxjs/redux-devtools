import {
  getActiveInstance,
  LIFTED_ACTION,
  SELECT_INSTANCE,
  StoreAction,
  StoreState,
  TOGGLE_PERSIST,
  UPDATE_STATE,
} from '@redux-devtools/app';
import { Dispatch, Middleware } from 'redux';

function panelDispatcher(
  bgConnection: chrome.runtime.Port,
): Middleware<{}, StoreState, Dispatch<StoreAction>> {
  let autoselected = false;
  const tabId = chrome.devtools.inspectedWindow.tabId;

  return (store) => (next) => (untypedAction) => {
    const action = untypedAction as StoreAction;

    const result = next(action);
    if (!autoselected && action.type === UPDATE_STATE && tabId) {
      autoselected = true;
      const connections = store.getState().instances.connections[tabId];
      if (connections && connections.length === 1) {
        next({ type: SELECT_INSTANCE, selected: connections[0] });
      }
    }
    if (action.type === LIFTED_ACTION || action.type === TOGGLE_PERSIST) {
      const instances = store.getState().instances;
      const instanceId = getActiveInstance(instances);
      const id = instances.options[instanceId].connectionId;
      bgConnection.postMessage({ ...action, instanceId, id });
    }
    return result;
  };
}

export default panelDispatcher;
