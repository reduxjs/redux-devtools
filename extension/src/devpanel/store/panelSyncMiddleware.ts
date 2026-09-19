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
  const instanceId = getSoleInstanceForTab(tabId, instances.connections);
  if (instanceId !== undefined) {
    next({ type: SELECT_INSTANCE, selected: instanceId });
  }
}

// Background keys connections by `tabId` for the top frame and
// `${tabId}-${frameId}` for iframes. Prefer a lone top-frame store; otherwise
// fall back to a lone store anywhere in the tab's frames.
export function getSoleInstanceForTab(
  tabId: number,
  connections: StoreState['instances']['connections'],
): string | number | undefined {
  const topFrame = connections[tabId];
  if (topFrame && topFrame.length > 0) {
    return topFrame.length === 1 ? topFrame[0] : undefined;
  }
  const framePrefix = `${tabId}-`;
  const inFrames = Object.entries(connections)
    .filter(([id]) => id.startsWith(framePrefix))
    .flatMap(([, instanceIds]) => instanceIds);
  return inFrames.length === 1 ? inFrames[0] : undefined;
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
): Middleware<{}, StoreState, Dispatch<StoreAction>> {
  let autoselected = false;
  let userChoseAutoselect = false;

  return (store) => (next) => (untypedAction) => {
    const action = untypedAction as StoreAction;

    if (action.type === SELECT_INSTANCE) {
      userChoseAutoselect = !action.selected;
    }

    const result = next(action);
    if (action.type === UPDATE_STATE) {
      const inspectedTabId = chrome.devtools?.inspectedWindow?.tabId;
      if (inspectedTabId !== undefined) {
        // A devtools panel belongs to one tab. While no instance is picked
        // explicitly, keep it pinned to that tab's store instead of following
        // whichever tab dispatched last. A page reload removes the old
        // instance and clears `selected`, so this re-pins to the new one.
        if (!userChoseAutoselect && !store.getState().instances.selected) {
          selectInstance(inspectedTabId, store, next);
        }
      } else if (!autoselected) {
        autoselected = true;
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
