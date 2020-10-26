// Mock not supported chrome.* API for Firefox and Electron

window.isElectron = window.navigator &&
  window.navigator.userAgent.indexOf('Electron') !== -1;

const isFirefox = navigator.userAgent.indexOf('Firefox') !== -1;

// Background page only
if (
  window.isElectron &&
  location.pathname === '/_generated_background_page.html' ||
  isFirefox
) {
  chrome.runtime.onConnectExternal = {
    addListener() {}
  };
  chrome.runtime.onMessageExternal = {
    addListener() {}
  };

  if (window.isElectron) {
    chrome.notifications = {
      onClicked: {
        addListener() {}
      },
      create() {},
      clear() {}
    };
    chrome.contextMenus = {
      onClicked: {
        addListener() {}
      }
    };
  } else {
    chrome.storage.sync = chrome.storage.local;
    chrome.runtime.onInstalled = {
      addListener: cb => cb()
    };
  }
}

if (window.isElectron) {
  if (!chrome.storage.local || !chrome.storage.local.remove) {
    chrome.storage.local = {
      set(obj, callback) {
        Object.keys(obj).forEach(key => {
          localStorage.setItem(key, obj[key]);
        });
        if (callback) {
          callback();
        }
      },
      get(obj, callback) {
        const result = {};
        Object.keys(obj).forEach(key => {
          result[key] = localStorage.getItem(key) || obj[key];
        });
        if (callback) {
          callback(result);
        }
      },
      // Electron ~ 1.4.6
      remove(items, callback) {
        if (Array.isArray(items)) {
          items.forEach(name => {
            localStorage.removeItem(name);
          });
        } else {
          localStorage.removeItem(items);
        }
        if (callback) {
          callback();
        }
      }
    };
  }
  // Avoid error: chrome.runtime.sendMessage is not supported responseCallback
  const originSendMessage = chrome.runtime.sendMessage;
  chrome.runtime.sendMessage = function() {
    if (process.env.NODE_ENV === 'development') {
      return originSendMessage(...arguments);
    }
    if (typeof arguments[arguments.length - 1] === 'function') {
      Array.prototype.pop.call(arguments);
    }
    return originSendMessage(...arguments);
  };
}

if (isFirefox) {
  chrome.storage.sync = chrome.storage.local;
}
