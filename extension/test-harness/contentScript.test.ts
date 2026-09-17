/**
 * Tier 1 harness sketch: drives the real contentScript module in jsdom with a
 * fake `chrome` object. Covers the hop pageScript -> contentScript -> background
 * (via a fake `chrome.runtime.Port`) and the reverse direction.
 *
 * The module has import-time side effects (see handoff notes), so it is
 * imported dynamically after the fake chrome is installed, and each test file
 * gets exactly one module instance. Tests below are therefore ordered and share
 * state deliberately; a clean `install(chrome, window)` API would remove that.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  createFakeChrome,
  FakeChrome,
  installFakeChrome,
  nextTick,
} from './fakeChrome.js';

const pageSource = '@devtools-page';
const extensionSource = '@devtools-extension';

interface PostedMessage {
  readonly source?: string;
  readonly type?: string;
  readonly name?: string;
  readonly [key: string]: unknown;
}

let fake: FakeChrome;
const windowMessages: PostedMessage[] = [];

/**
 * The contentScript drops any message where `event.source !== window`.
 * jsdom's `window.postMessage` delivers events with `source: null` (happy-dom
 * sets it to an internal window object that is not the exposed global), so the
 * harness dispatches the MessageEvent itself with an explicit source.
 */
function postFromPage(message: PostedMessage) {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { source: pageSource, ...message },
      origin: window.location.origin,
      source: window,
    }),
  );
  return nextTick();
}

const fromExtension = () =>
  windowMessages.filter((m) => m.source === extensionSource);

beforeAll(async () => {
  fake = createFakeChrome();
  installFakeChrome(fake);
  window.addEventListener('message', (e: MessageEvent<PostedMessage>) => {
    windowMessages.push(e.data);
  });
  await import('../src/contentScript/index.js');
});

describe('contentScript with fake chrome (Tier 1 sketch)', () => {
  it('does not connect to the background at import time', () => {
    expect(fake.runtime.connect).not.toHaveBeenCalled();
  });

  it('real window.postMessage does not reach the contentScript under jsdom (event.source !== window)', async () => {
    let source: MessageEventSource | null | undefined;
    const probe = (e: MessageEvent) => {
      source = e.source;
    };
    window.addEventListener('message', probe);
    window.postMessage({ source: 'source-probe' }, '*');
    await nextTick();
    window.removeEventListener('message', probe);
    expect(source).not.toBe(window);
    expect(fake.ports).toHaveLength(0);
  });

  it('INIT_INSTANCE from the page opens a "tab" port and forwards INIT_INSTANCE, then answers OPTIONS', async () => {
    await postFromPage({ type: 'INIT_INSTANCE', instanceId: 1 });

    expect(fake.ports).toHaveLength(1);
    expect(fake.runtime.connect).toHaveBeenCalledWith({ name: 'tab' });
    const port = fake.ports[0];
    expect(port.sent).toEqual([{ name: 'INIT_INSTANCE', instanceId: 1 }]);

    const options = fromExtension().find((m) => m.type === 'OPTIONS');
    expect(options).toBeDefined();
    expect(options).toMatchObject({
      options: expect.objectContaining({ maxAge: 50, inject: true }),
    });
  });

  it('wraps every other page message in RELAY on the same port', async () => {
    const port = fake.ports[0];
    const action = { type: 'INCREMENT' };
    await postFromPage({
      type: 'ACTION',
      instanceId: 1,
      action: JSON.stringify(action),
      payload: '{"count":1}',
      maxAge: 50,
    });

    expect(fake.ports).toHaveLength(1);
    expect(port.sent).toHaveLength(2);
    expect(port.sent[1]).toMatchObject({
      name: 'RELAY',
      message: {
        source: pageSource,
        type: 'ACTION',
        instanceId: 1,
        action: JSON.stringify(action),
      },
    });
  });

  it('ignores window messages that are not from the page script', async () => {
    const port = fake.ports[0];
    for (const data of [
      { source: 'someone-else', type: 'ACTION' },
      'a string',
    ]) {
      window.dispatchEvent(
        new MessageEvent('message', { data, source: window }),
      );
    }
    await nextTick();
    expect(port.sent).toHaveLength(2);
  });

  it('relays background -> page messages with the extension source', async () => {
    const port = fake.ports[0];
    const before = fromExtension().length;
    port.receive({ type: 'START', id: '1' });
    port.receive({
      type: 'DISPATCH',
      action: { type: 'JUMP_TO_STATE', index: 0 },
      state: undefined,
      id: '1',
    });
    await nextTick();

    const received = fromExtension().slice(before);
    expect(received).toEqual([
      { type: 'START', state: undefined, id: '1', source: extensionSource },
      {
        type: 'DISPATCH',
        payload: { type: 'JUMP_TO_STATE', index: 0 },
        state: undefined,
        id: '1',
        source: extensionSource,
      },
    ]);
  });

  it('on port disconnect: posts STOP failed:true and stops listening for good (no reconnect)', async () => {
    const port = fake.ports[0];
    port.dropFromOtherSide();
    await nextTick();

    expect(fromExtension().at(-1)).toEqual({
      type: 'STOP',
      failed: true,
      source: extensionSource,
    });

    await postFromPage({ type: 'INIT_INSTANCE', instanceId: 2 });
    await postFromPage({ type: 'ACTION', instanceId: 2, action: '{}' });

    // Documents the P-2/P-3 defect: the window listener was removed, so the
    // page can never re-establish the connection without a full reload.
    expect(fake.ports).toHaveLength(1);
    expect(port.sent).toHaveLength(2);
  });
});
