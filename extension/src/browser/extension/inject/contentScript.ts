import {
  injectOptions,
  getOptionsFromBg,
  isAllowed,
} from '../options/syncOptions';
import { TabMessage } from '../../../app/middlewares/api';
const source = '@devtools-extension';
const pageSource = '@devtools-page';
// Chrome message limit is 64 MB, but we're using 32 MB to include other object's parts
const maxChromeMsgSize = 32 * 1024 * 1024;
let connected = false;
let bg: chrome.runtime.Port | undefined;

declare global {
  interface Window {
    devToolsExtensionID?: string;
  }
}

function connect() {
  // Connect to the background script
  connected = true;
  const name = 'tab';
  if (window.devToolsExtensionID) {
    bg = chrome.runtime.connect(window.devToolsExtensionID, { name });
  } else {
    bg = chrome.runtime.connect({ name });
  }

  // Relay background script messages to the page script
  bg.onMessage.addListener((message: TabMessage) => {
    if ('action' in message) {
      window.postMessage(
        {
          type: message.type,
          payload: message.action,
          state: message.state,
          id: message.id,
          source,
        },
        '*'
      );
    } else if ('options' in message) {
      injectOptions(message.options);
    } else {
      window.postMessage(
        {
          type: message.type,
          state: message.state,
          id: message.id,
          source,
        },
        '*'
      );
    }
  });

  bg.onDisconnect.addListener(handleDisconnect);
}

function handleDisconnect() {
  window.removeEventListener('message', handleMessages);
  window.postMessage({ type: 'STOP', failed: true, source }, '*');
  bg = undefined;
}

function tryCatch<A>(
  fn: (args: PageScriptToContentScriptMessage) => void,
  args: PageScriptToContentScriptMessage
) {
  try {
    return fn(args);
  } catch (err) {
    if (err.message === 'Message length exceeded maximum allowed length.') {
      const instanceId = args.instanceId;
      const newArgs = { split: 'start' };
      const toSplit = [];
      let size = 0;
      let arg;
      Object.keys(args).map((key) => {
        arg = args[key];
        if (typeof arg === 'string') {
          size += arg.length;
          if (size > maxChromeMsgSize) {
            toSplit.push([key, arg]);
            return;
          }
        }
        newArgs[key] = arg;
      });
      fn(newArgs);
      for (let i = 0; i < toSplit.length; i++) {
        for (let j = 0; j < toSplit[i][1].length; j += maxChromeMsgSize) {
          fn({
            instanceId,
            source: pageSource,
            split: 'chunk',
            chunk: [toSplit[i][0], toSplit[i][1].substr(j, maxChromeMsgSize)],
          });
        }
      }
      return fn({ instanceId, source: pageSource, split: 'end' });
    }
    handleDisconnect();
    /* eslint-disable no-console */
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to send message', err);
    }
    /* eslint-enable no-console */
  }
}

interface InitInstancePageScriptToContentScriptMessage {
  readonly type: 'INIT_INSTANCE';
  readonly instanceId: number;
  readonly source: typeof pageSource;
}

interface DisconnectMessage {
  readonly type: 'DISCONNECT';
  readonly source: typeof pageSource;
}

export type PageScriptToContentScriptMessage =
  | InitInstancePageScriptToContentScriptMessage
  | DisconnectMessage;

interface InitInstanceContentScriptToBackgroundMessage {
  readonly name: 'INIT_INSTANCE';
  readonly instanceId: number;
}

interface RelayMessage {
  readonly name: 'RELAY';
  readonly message: unknown;
}

export type ContentScriptToBackgroundMessage =
  | InitInstanceContentScriptToBackgroundMessage
  | RelayMessage;

function postToBackground(message: ContentScriptToBackgroundMessage) {
  bg!.postMessage(message);
}

function send(message: never) {
  if (!connected) connect();
  if (message.type === 'INIT_INSTANCE') {
    getOptionsFromBg();
    postToBackground({ name: 'INIT_INSTANCE', instanceId: message.instanceId });
  } else {
    postToBackground({ name: 'RELAY', message });
  }
}

// Resend messages from the page to the background script
function handleMessages(event: MessageEvent<PageScriptToContentScriptMessage>) {
  if (!isAllowed()) return;
  if (!event || event.source !== window || typeof event.data !== 'object') {
    return;
  }
  const message = event.data;
  if (message.source !== pageSource) return;
  if (message.type === 'DISCONNECT') {
    if (bg) {
      bg.disconnect();
      connected = false;
    }
    return;
  }

  tryCatch(send, message);
}

window.addEventListener('message', handleMessages, false);
