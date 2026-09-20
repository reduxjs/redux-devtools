import '../chromeApiMock.js';
import {
  getOptions,
  isAllowed,
  Options,
  prepareOptionsForPage,
} from '../options/syncOptions.js';
import type { TabMessage } from '../background/store/apiMiddleware.js';
import type {
  PageScriptToContentScriptMessage,
  PageScriptToContentScriptMessageWithoutDisconnect,
  PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance,
} from '../pageScript/api/index.js';
import { Action } from 'redux';
import {
  CustomAction,
  DispatchAction as AppDispatchAction,
} from '@redux-devtools/app';
import { LiftedState } from '@redux-devtools/instrument';
import {
  exceedsChromeMsgSize,
  isMessageSizeError,
  splitMessage,
} from '../utils/splitMessage.js';
import {
  createReconnectingPort,
  ReconnectingPort,
} from '../utils/reconnectingPort.js';

const source = '@devtools-extension';
const pageSource = '@devtools-page';
let bg:
  | ReconnectingPort<ContentScriptToBackgroundMessage<unknown, Action>>
  | undefined;
const knownInstanceIds = new Set<number>();

declare global {
  interface Window {
    devToolsExtensionID?: string;
  }
}

interface StartAction {
  readonly type: 'START';
  readonly state: undefined;
  readonly id: undefined;
  readonly source: typeof source;
}

interface StopAction {
  readonly type: 'STOP';
  readonly state: undefined;
  readonly id: undefined;
  readonly source: typeof source;
  readonly failed?: boolean;
}

interface DispatchAction {
  readonly type: 'DISPATCH';
  readonly payload: AppDispatchAction;
  readonly state: string | undefined;
  readonly id: string;
  readonly source: typeof source;
}

interface ImportAction {
  readonly type: 'IMPORT';
  readonly payload: undefined;
  readonly state: string | undefined;
  readonly id: string;
  readonly source: typeof source;
}

interface ActionAction {
  readonly type: 'ACTION';
  readonly payload: string | CustomAction;
  readonly state: string | undefined;
  readonly id: string;
  readonly source: typeof source;
}

interface ExportAction {
  readonly type: 'EXPORT';
  readonly payload: undefined;
  readonly state: string | undefined;
  readonly id: string;
  readonly source: typeof source;
}

interface UpdateAction {
  readonly type: 'UPDATE';
  readonly state: string | undefined;
  readonly id: string;
  readonly source: typeof source;
}

interface OptionsAction {
  readonly type: 'OPTIONS';
  readonly options: Options;
  readonly id: undefined;
  readonly source: typeof source;
}

export type ContentScriptToPageScriptMessage =
  | StartAction
  | StopAction
  | DispatchAction
  | ImportAction
  | ActionAction
  | ExportAction
  | UpdateAction
  | OptionsAction;

interface ImportStatePayload<S, A extends Action<string>> {
  readonly type: 'IMPORT_STATE';
  readonly nextLiftedState: LiftedState<S, A, unknown> | readonly A[];
  readonly preloadedState?: S;
}

interface ImportStateDispatchAction<S, A extends Action<string>> {
  readonly type: 'DISPATCH';
  readonly payload: ImportStatePayload<S, A>;
}

export type ListenerMessage<S, A extends Action<string>> =
  | StartAction
  | StopAction
  | DispatchAction
  | ImportAction
  | ActionAction
  | ExportAction
  | UpdateAction
  | OptionsAction
  | ImportStateDispatchAction<S, A>;

function postToPageScript(message: ContentScriptToPageScriptMessage) {
  window.postMessage(message, '*');
}

function sendOptionsToPage() {
  getOptions((options) => {
    postToPageScript({
      type: 'OPTIONS',
      options: prepareOptionsForPage(options),
      id: undefined,
      source,
    });
  });
}

function connectPort() {
  const name = 'tab';
  if (window.devToolsExtensionID) {
    return chrome.runtime.connect(window.devToolsExtensionID, { name });
  }
  return chrome.runtime.connect({ name });
}

function getBackground() {
  if (bg) return bg;
  bg = createReconnectingPort<
    ContentScriptToBackgroundMessage<unknown, Action>,
    TabMessage
  >({
    connect: connectPort,
    onMessage: relayToPage,
    // A restarted service worker has forgotten every instance. Re-announce
    // them so it enables the action icon and, if a monitor is open, asks the
    // page for its full state again.
    onConnect: (post) => {
      for (const instanceId of knownInstanceIds) {
        post({ name: 'INIT_INSTANCE', instanceId });
      }
    },
    onGiveUp: handleGiveUp,
  });
  return bg;
}

// Relay background script messages to the page script
function relayToPage(message: TabMessage) {
  if ('action' in message) {
    if (message.type === 'DISPATCH') {
      postToPageScript({
        type: message.type,
        payload: message.action,
        state: message.state,
        id: message.id,
        source,
      });
    } else if (message.type === 'ACTION') {
      postToPageScript({
        type: message.type,
        payload: message.action,
        state: message.state,
        id: message.id,
        source,
      });
    } else {
      postToPageScript({
        type: message.type,
        payload: message.action,
        state: message.state,
        id: message.id,
        source,
      });
    }
  } else if (message.type === 'OPTIONS') {
    postToPageScript({
      type: message.type,
      options: prepareOptionsForPage(message.options),
      id: undefined,
      source,
    });
  } else {
    postToPageScript({
      type: message.type,
      state: message.state,
      id: message.id,
      source,
    });
  }
}

// The extension was reloaded, updated, or removed: this content script belongs
// to a dead extension context and can never reach a background again. Tell the
// page to stop relaying; the next page load gets a fresh content script.
function handleGiveUp() {
  window.removeEventListener('message', handleMessages);
  window.postMessage({ type: 'STOP', failed: true, source }, '*');
  knownInstanceIds.clear();
  bg = undefined;
}

interface SplitMessageBase {
  readonly type?: never;
  readonly instanceId: number | undefined;
  readonly source: typeof pageSource;
}

interface SplitMessageStart extends SplitMessageBase {
  readonly split: 'start';
}

interface SplitMessageChunk extends SplitMessageBase {
  readonly split: 'chunk';
  readonly chunk: [string, string];
}

interface SplitMessageEnd extends SplitMessageBase {
  readonly split: 'end';
}

export type SplitMessage =
  | SplitMessageStart
  | SplitMessageChunk
  | SplitMessageEnd;

type SendableMessage<S, A extends Action<string>> =
  | PageScriptToContentScriptMessageWithoutDisconnect<S, A>
  | SplitMessage;

function sendInChunks<S, A extends Action<string>>(
  fn: (args: SendableMessage<S, A>) => void,
  args: PageScriptToContentScriptMessageWithoutDisconnect<S, A>,
) {
  const instanceId = 'instanceId' in args ? args.instanceId : undefined;
  const { start, chunks } = splitMessage(args);
  fn(start as unknown as SplitMessageStart);
  for (const chunk of chunks) {
    fn({ instanceId, source: pageSource, split: 'chunk', chunk });
  }
  fn({ instanceId, source: pageSource, split: 'end' });
}

function tryCatch<S, A extends Action<string>>(
  fn: (args: SendableMessage<S, A>) => void,
  args: PageScriptToContentScriptMessageWithoutDisconnect<S, A>,
) {
  const chunked = exceedsChromeMsgSize(args);
  let failure: unknown;
  try {
    if (chunked) {
      sendInChunks(fn, args);
    } else {
      fn(args);
    }
    return;
  } catch (err) {
    failure = err;
    if (!chunked && isMessageSizeError(err)) {
      try {
        sendInChunks(fn, args);
        return;
      } catch (chunkErr) {
        failure = chunkErr;
      }
    }
  }
  // Drop this message but keep relaying. A real port loss is handled by the
  // reconnecting port, which queues and redelivers.
  if (process.env.NODE_ENV !== 'production') {
    console.error('Failed to send message', failure);
  }
}

interface InitInstanceContentScriptToBackgroundMessage {
  readonly name: 'INIT_INSTANCE';
  readonly instanceId: number;
}

interface RelayMessage<S, A extends Action<string>> {
  readonly name: 'RELAY';
  readonly message:
    | PageScriptToContentScriptMessageWithoutDisconnectOrInitInstance<S, A>
    | SplitMessage;
}

export type ContentScriptToBackgroundMessage<S, A extends Action<string>> =
  | InitInstanceContentScriptToBackgroundMessage
  | RelayMessage<S, A>;

function postToBackground<S, A extends Action<string>>(
  message: ContentScriptToBackgroundMessage<S, A>,
) {
  getBackground().post(
    message as ContentScriptToBackgroundMessage<unknown, Action>,
  );
}

function send<S, A extends Action<string>>(
  message:
    | PageScriptToContentScriptMessageWithoutDisconnect<S, A>
    | SplitMessage,
) {
  if (message.type === 'INIT_INSTANCE') {
    sendOptionsToPage();
    knownInstanceIds.add(message.instanceId);
    const background = getBackground();
    // While disconnected, onConnect re-announces every known instance, so
    // only post directly when the port is already open.
    if (background.isConnected()) {
      background.post({
        name: 'INIT_INSTANCE',
        instanceId: message.instanceId,
      });
    } else {
      background.ensureConnected();
    }
  } else {
    postToBackground({ name: 'RELAY', message });
  }
}

// Resend messages from the page to the background script
function handleMessages<S, A extends Action<string>>(
  event: MessageEvent<PageScriptToContentScriptMessage<S, A>>,
) {
  if (!isAllowed()) return;
  if (!event || event.source !== window || typeof event.data !== 'object') {
    return;
  }
  const message = event.data;
  if (message.source !== pageSource) return;
  if (message.type === 'DISCONNECT') {
    bg?.disconnect();
    bg = undefined;
    knownInstanceIds.clear();
    return;
  }

  tryCatch(send, message);
}

// Push options to the page before any store is created so the first store on a
// denied host is not instrumented.
sendOptionsToPage();

window.addEventListener('message', handleMessages, false);
