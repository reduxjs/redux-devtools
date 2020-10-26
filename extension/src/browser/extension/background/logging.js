import { LIFTED_ACTION } from 'remotedev-app/lib/constants/actionTypes';

export function getReport(reportId, tabId, instanceId) {
  chrome.storage.local.get(['s:hostname', 's:port', 's:secure'], options => {
    if (!options['s:hostname'] || !options['s:port']) return;
    const url = `${options['s:secure'] ? 'https' : 'http'}://${options['s:hostname']}:${options['s:port']}`;

    fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ op: 'get', id: reportId })
    }).then(response => {
      return response.json();
    }).then(json => {
      const { payload, preloadedState } = json;
      if (!payload) return;
      window.store.dispatch({
        type: LIFTED_ACTION,
        message: 'IMPORT',
        state: JSON.stringify({ payload, preloadedState }),
        id: tabId,
        instanceId: `${tabId}/${instanceId}`
      });
    }).catch(function(err) {
      /* eslint-disable no-console */
      console.warn(err);
      /* eslint-enable no-console */
    });
  });
}
