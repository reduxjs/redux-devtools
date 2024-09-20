import {
  getActiveInstance,
  LIFTED_ACTION,
  SELECT_INSTANCE,
  StoreAction,
  StoreState,
  TOGGLE_PERSIST,
  UPDATE_STATE,
} from '@redux-devtools/app';
import { Dispatch, Middleware, MiddlewareAPI } from 'redux';

function selectInstance(
  tabId: number,
  store: MiddlewareAPI<Dispatch<StoreAction>, StoreState>,
  next: (action: unknown) => unknown,
) {
  const instances = store.getState().instances;
  if (instances.current === 'default') return;
  const connections = instances.connections[tabId];
  if (connections && connections.length === 1) {
    next({ type: SELECT_INSTANCE, selected: connections[0] });
  }
}

function getCurrentTabId(next: (tabId: number) => void) {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    (tabs) => {
      const tab = tabs[0];
      if (!tab) return;
      next(tab.id!);
    },
  );
}

function panelDispatcher(
  bgConnection: chrome.runtime.Port,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
): Middleware<{}, StoreState, Dispatch<StoreAction>> {
  let autoselected = false;

  return (store) => (next) => (untypedAction) => {
    const action = untypedAction as StoreAction;

    const result = next(action);
    if (!autoselected && action.type === UPDATE_STATE) {
      autoselected = true;

      if (chrome.devtools && chrome.devtools.inspectedWindow) {
        selectInstance(chrome.devtools.inspectedWindow.tabId, store, next);
      } else {
        getCurrentTabId((tabId) => selectInstance(tabId, store, next));
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
