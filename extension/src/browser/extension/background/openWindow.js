let windows = {};
let lastPosition = null;

export default function openDevToolsWindow(position) {
  function popWindow(action, url, customOptions) {
    function focusIfExist(callback) {
      if (!windows[position]) {
        callback();
        lastPosition = position;
      } else {
        let params = {focused: true};
        if (lastPosition !== position && position !== 'devtools-panel') params = {...params, ...customOptions};
        chrome.windows.update(windows[position], params, () => {
          lastPosition = null;
          if (chrome.runtime.lastError) callback();
        });
      }
    }

    focusIfExist(() => {
      let options = {
        type: 'popup',
        ...customOptions
      };
      if (action === 'open') {
        options.url = chrome.extension.getURL(url + '#' + position.substr(position.indexOf('-') + 1));
        chrome.windows.create(options, (win) => {
          windows[position] = win.id;
          if (navigator.userAgent.indexOf('Firefox') !== -1) {
            chrome.windows.update(win.id, { focused: true, ...customOptions });
          }
        });
      }
    });
  }

  let params = { left: 0, top: 0, width: 380, height: window.screen.availHeight };
  let url = 'window.html';
  switch (position) {
    case 'devtools-right':
      params.left = window.screen.availLeft + window.screen.availWidth - params.width;
      break;
    case 'devtools-bottom':
      params.height = 420;
      params.top = window.screen.height - params.height;
      params.width = window.screen.availWidth;
      break;
    case 'devtools-panel':
      params.type = 'panel';
      break;
    case 'devtools-remote':
      params = { width: 850, height: 600 };
      url = 'remote.html';
      break;
  }
  popWindow('open', url, params);
}
