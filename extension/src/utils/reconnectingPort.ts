import { isMessageSizeError } from './splitMessage.js';

export interface ReconnectingPortOptions<Outgoing, Incoming> {
  readonly connect: () => chrome.runtime.Port;
  readonly onMessage: (message: Incoming) => void;
  /**
   * Runs after every successful connection, before queued messages are
   * flushed. Use it to re-announce state the other side lost.
   */
  readonly onConnect?: (post: (message: Outgoing) => void) => void;
  /** Runs once when the extension context is gone and no retry can succeed. */
  readonly onGiveUp?: () => void;
  readonly baseDelay?: number;
  readonly maxDelay?: number;
  readonly maxQueue?: number;
}

export interface ReconnectingPort<Outgoing> {
  /** Sends now when connected, otherwise queues and (re)connects. */
  readonly post: (message: Outgoing) => void;
  /** Opens the port if it is not open and no retry is already scheduled. */
  readonly ensureConnected: () => void;
  readonly isConnected: () => boolean;
  /** Closes the port for good and drops queued messages. */
  readonly disconnect: () => void;
}

const DEFAULT_BASE_DELAY = 100;
const DEFAULT_MAX_DELAY = 5_000;
const DEFAULT_MAX_QUEUE = 500;
const STABLE_CONNECTION_MS = 1_000;

function extensionContextAlive() {
  return typeof chrome !== 'undefined' && !!chrome.runtime?.id;
}

/**
 * Wraps `chrome.runtime.connect` so a port that the other side drops (MV3
 * service worker termination, extension reload) is reopened with a backoff,
 * and messages sent in the meantime are delivered once it is back.
 */
export function createReconnectingPort<Outgoing, Incoming>(
  options: ReconnectingPortOptions<Outgoing, Incoming>,
): ReconnectingPort<Outgoing> {
  const baseDelay = options.baseDelay ?? DEFAULT_BASE_DELAY;
  const maxDelay = options.maxDelay ?? DEFAULT_MAX_DELAY;
  const maxQueue = options.maxQueue ?? DEFAULT_MAX_QUEUE;

  let port: chrome.runtime.Port | undefined;
  let connectedAt = 0;
  let retryDelay = baseDelay;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let closed = false;
  let gaveUp = false;
  const queue: Outgoing[] = [];

  function enqueue(message: Outgoing) {
    if (queue.length >= maxQueue) queue.shift();
    queue.push(message);
  }

  function postNow(target: chrome.runtime.Port, message: Outgoing) {
    target.postMessage(message);
  }

  function giveUp() {
    if (gaveUp) return;
    gaveUp = true;
    queue.length = 0;
    options.onGiveUp?.();
  }

  function scheduleRetry() {
    if (retryTimer !== undefined || closed || gaveUp) return;
    retryTimer = setTimeout(() => {
      retryTimer = undefined;
      open();
    }, retryDelay);
    retryDelay = Math.min(retryDelay * 2, maxDelay);
  }

  function handleDisconnect(dropped: chrome.runtime.Port) {
    if (dropped !== port) return;
    port = undefined;
    if (closed) return;
    if (Date.now() - connectedAt >= STABLE_CONNECTION_MS) {
      retryDelay = baseDelay;
    }
    scheduleRetry();
  }

  function open(): boolean {
    if (port || closed || gaveUp) return !!port;
    if (!extensionContextAlive()) {
      giveUp();
      return false;
    }
    let next: chrome.runtime.Port;
    try {
      next = options.connect();
    } catch {
      if (!extensionContextAlive()) giveUp();
      else scheduleRetry();
      return false;
    }
    port = next;
    connectedAt = Date.now();
    next.onMessage.addListener((message: Incoming) => {
      options.onMessage(message);
    });
    next.onDisconnect.addListener(() => handleDisconnect(next));

    options.onConnect?.((message) => postNow(next, message));
    while (queue.length > 0 && port === next) {
      const message = queue.shift()!;
      try {
        postNow(next, message);
      } catch {
        queue.unshift(message);
        handleDisconnect(next);
        return false;
      }
    }
    return true;
  }

  function post(message: Outgoing) {
    if (gaveUp || closed) return;
    if (!port) {
      enqueue(message);
      if (retryTimer === undefined) open();
      return;
    }
    try {
      postNow(port, message);
    } catch (err) {
      if (isMessageSizeError(err)) throw err;
      enqueue(message);
      handleDisconnect(port);
    }
  }

  function ensureConnected() {
    if (!port && retryTimer === undefined) open();
  }

  function disconnect() {
    closed = true;
    if (retryTimer !== undefined) {
      clearTimeout(retryTimer);
      retryTimer = undefined;
    }
    queue.length = 0;
    const current = port;
    port = undefined;
    current?.disconnect();
  }

  return {
    post,
    ensureConnected,
    isConnected: () => port !== undefined,
    disconnect,
  };
}
