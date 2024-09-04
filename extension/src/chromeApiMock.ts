// Mock not supported chrome.* API for Firefox and Electron

const isElectron = navigator.userAgent.includes('Electron');
const isFirefox = navigator.userAgent.includes('Firefox');

// Background page only
if (
  (isElectron && location.pathname === '/background.bundle.js') ||
  isFirefox
) {
  (chrome.runtime as any).onConnectExternal = {
    addListener() {},
  };
  (chrome.runtime as any).onMessageExternal = {
    addListener() {},
  };

  if (isElectron) {
    (chrome.notifications as any) = {
      onClicked: {
        addListener() {},
      },
      create() {},
      clear() {},
    };
    (chrome.contextMenus as any) = {
      onClicked: {
        addListener() {},
      },
    };
    (chrome.commands as any) = {
      onCommand: {
        addListener() {},
      },
    };
  } else {
    (chrome.storage as any).sync = chrome.storage.local;
    (chrome.runtime as any).onInstalled = {
      addListener: (cb: any) => cb(),
    };
  }
}

if (isElectron) {
  if (!chrome.storage.local || !chrome.storage.local.remove) {
    (chrome.storage as any).local = {
      set(obj: any, callback: any) {
        Object.keys(obj).forEach((key) => {
          localStorage.setItem(key, obj[key]);
        });
        if (callback) {
          callback();
        }
      },
      get(obj: any, callback: any) {
        const result: any = {};
        Object.keys(obj).forEach((key) => {
          result[key] = localStorage.getItem(key) || obj[key];
        });
        if (callback) {
          callback(result);
        }
      },
      // Electron ~ 1.4.6
      remove(items: any, callback: any) {
        if (Array.isArray(items)) {
          items.forEach((name) => {
            localStorage.removeItem(name);
          });
        } else {
          localStorage.removeItem(items);
        }
        if (callback) {
          callback();
        }
      },
    };
  }
  // Avoid error: chrome.runtime.sendMessage is not supported responseCallback
  const originSendMessage = (chrome.runtime as any).sendMessage;
  chrome.runtime.sendMessage = function () {
    if (process.env.NODE_ENV === 'development') {
      return originSendMessage(...arguments);
    }
    if (typeof arguments[arguments.length - 1] === 'function') {
      Array.prototype.pop.call(arguments);
    }
    return originSendMessage(...arguments);
  };
}

if (isFirefox || isElectron) {
  (chrome.storage as any).sync = chrome.storage.local;
}
