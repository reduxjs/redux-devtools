import { SELECT_INSTANCE, UPDATE_STATE } from 'remotedev-app/lib/constants/actionTypes';

function selectInstance(tabId, store, next) {
  const instances = store.getState().instances;
  if (instances.current === 'default') return;
  const connections = instances.connections[tabId];
  if (connections && connections.length === 1) {
    next({ type: SELECT_INSTANCE, selected: connections[0] });
  }
}

function getCurrentTabId(next) {
  chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  }, tabs => {
    const tab = tabs[0];
    if (!tab) return;
    next(tab.id);
  });
}

export default function popupSelector(store) {
  return next => action => {
    const result = next(action);
    if (action.type === UPDATE_STATE) {
      if (chrome.devtools && chrome.devtools.inspectedWindow) {
        selectInstance(chrome.devtools.inspectedWindow.tabId, store, next);
      } else {
        getCurrentTabId(tabId => selectInstance(tabId, store, next));
      }
    }
    return result;
  };
}
