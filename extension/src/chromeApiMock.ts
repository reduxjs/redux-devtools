// Mock not supported chrome.* API for Firefox and Electron

const isElectron = navigator.userAgent.includes('Electron');
const isFirefox = navigator.userAgent.includes('Firefox');

// Background page only
if (
  (isElectron && location.pathname === '/background.bundle.js') ||
  isFirefox
) {
  (chrome.runtime as any).onConnectExternal = {
    addListener() {
      // do nothing.
    },
  };
  (chrome.runtime as any).onMessageExternal = {
    addListener() {
      // do nothing.
    },
  };

  if (isElectron) {
    (chrome.notifications as any) = {
      onClicked: {
        addListener() {
          // do nothing.
        },
      },
      create() {
        // do nothing.
      },
      clear() {
        // do nothing.
      },
    };
    (chrome.contextMenus as any) = {
      onClicked: {
        addListener() {
          // do nothing.
        },
      },
    };
    (chrome.commands as any) = {
      onCommand: {
        addListener() {
          // do nothing.
        },
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
      set(items: { [key: string]: string }, callback: () => void) {
        for (const [key, value] of Object.entries(items)) {
          localStorage.setItem(key, value);
        }
        if (callback) {
          callback();
        }
      },
      get(
        keys: { [key: string]: any },
        callback: (items: { [key: string]: any }) => void,
      ) {
        const result = Object.fromEntries(
          Object.entries(keys).map(([key, value]) => [
            key,
            localStorage.getItem(key) ?? value,
          ]),
        );
        if (callback) {
          callback(result);
        }
      },
      // Electron ~ 1.4.6
      remove(keys: string | string[], callback: () => void) {
        if (Array.isArray(keys)) {
          for (const key of keys) {
            localStorage.removeItem(key);
          }
        } else {
          localStorage.removeItem(keys);
        }
        if (callback) {
          callback();
        }
      },
    };
  }
  // Avoid error: chrome.runtime.sendMessage is not supported responseCallback
  const originSendMessage = (chrome.runtime as any).sendMessage;
  (chrome.runtime as any).sendMessage = function (...args: unknown[]) {
    if (process.env.NODE_ENV === 'development') {
      return originSendMessage(...args);
    }
    if (typeof args[arguments.length - 1] === 'function') {
      Array.prototype.pop.call(args);
    }
    return originSendMessage(...args);
  };
}

if (isFirefox || isElectron) {
  (chrome.storage as any).sync = chrome.storage.local;
}
