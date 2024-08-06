import { Dispatch, Middleware, MiddlewareAPI } from 'redux';
import {
  SELECT_INSTANCE,
  StoreAction,
  StoreState,
  UPDATE_STATE,
} from '@redux-devtools/app';

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

const popupSelector: Middleware<{}, StoreState, Dispatch<StoreAction>> =
  (store) => (next) => (untypedAction) => {
    const action = untypedAction as StoreAction;

    const result = next(action);
    if (action.type === UPDATE_STATE) {
      if (chrome.devtools && chrome.devtools.inspectedWindow) {
        selectInstance(chrome.devtools.inspectedWindow.tabId, store, next);
      } else {
        getCurrentTabId((tabId) => selectInstance(tabId, store, next));
      }
    }
    return result;
  };

export default popupSelector;
