import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createFakeChrome,
  FakeChrome,
  FakePort,
  installFakeChrome,
} from './fakeChrome.js';
import { createReconnectingPort } from '../src/utils/reconnectingPort.js';

interface Msg {
  readonly type: string;
}

let fake: FakeChrome;

function build(
  overrides: { onConnect?: (post: (m: Msg) => void) => void } = {},
) {
  const received: Msg[] = [];
  const onGiveUp = vi.fn();
  const port = createReconnectingPort<Msg, Msg>({
    connect: () =>
      fake.runtime.connect({ name: 'tab' }) as unknown as chrome.runtime.Port,
    onMessage: (m) => received.push(m),
    onConnect: overrides.onConnect,
    onGiveUp,
    baseDelay: 100,
    maxDelay: 400,
    maxQueue: 3,
  });
  return { port, received, onGiveUp };
}

const lastPort = (): FakePort => fake.ports[fake.ports.length - 1];

beforeEach(() => {
  vi.useFakeTimers();
  fake = createFakeChrome();
  installFakeChrome(fake);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('createReconnectingPort', () => {
  it('connects lazily on the first post and relays incoming messages', () => {
    const { port, received } = build();
    expect(fake.ports).toHaveLength(0);

    port.post({ type: 'A' });
    expect(fake.ports).toHaveLength(1);
    expect(lastPort().sent).toEqual([{ type: 'A' }]);
    expect(port.isConnected()).toBe(true);

    lastPort().receive({ type: 'FROM_BG' });
    expect(received).toEqual([{ type: 'FROM_BG' }]);
  });

  it('reconnects after the other side drops the port, replays onConnect, then flushes the queue', () => {
    const onConnect = vi.fn((post: (m: Msg) => void) => {
      post({ type: 'INIT' });
    });
    const { port } = build({ onConnect });
    port.ensureConnected();
    const first = lastPort();
    expect(first.sent).toEqual([{ type: 'INIT' }]);

    first.dropFromOtherSide();
    expect(port.isConnected()).toBe(false);
    port.post({ type: 'B' });
    port.post({ type: 'C' });
    expect(fake.ports).toHaveLength(1);

    vi.advanceTimersByTime(99);
    expect(fake.ports).toHaveLength(1);
    vi.advanceTimersByTime(1);
    expect(fake.ports).toHaveLength(2);
    expect(lastPort().sent).toEqual([
      { type: 'INIT' },
      { type: 'B' },
      { type: 'C' },
    ]);
    expect(onConnect).toHaveBeenCalledTimes(2);
  });

  it('backs off between rapid failures and resets after a stable connection', () => {
    const { port } = build();
    port.ensureConnected();

    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(100);
    expect(fake.ports).toHaveLength(2);

    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(199);
    expect(fake.ports).toHaveLength(2);
    vi.advanceTimersByTime(1);
    expect(fake.ports).toHaveLength(3);

    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(400);
    expect(fake.ports).toHaveLength(4);

    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(400);
    expect(fake.ports).toHaveLength(5);

    vi.advanceTimersByTime(1_000);
    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(100);
    expect(fake.ports).toHaveLength(6);
  });

  it('keeps only the newest messages when the queue overflows', () => {
    const { port } = build();
    port.ensureConnected();
    lastPort().dropFromOtherSide();
    for (const type of ['1', '2', '3', '4', '5']) port.post({ type });

    vi.advanceTimersByTime(100);
    expect(lastPort().sent).toEqual([
      { type: '3' },
      { type: '4' },
      { type: '5' },
    ]);
  });

  it('treats a postMessage failure as a disconnect and redelivers the message', () => {
    const { port } = build();
    port.ensureConnected();
    const first = lastPort();
    first.postMessage.mockImplementationOnce(() => {
      throw new Error('Attempting to use a disconnected port object');
    });

    port.post({ type: 'X' });
    expect(port.isConnected()).toBe(false);

    vi.advanceTimersByTime(100);
    expect(fake.ports).toHaveLength(2);
    expect(lastPort().sent).toEqual([{ type: 'X' }]);
  });

  it('rethrows message size errors so the chunking fallback can handle them', () => {
    const { port } = build();
    port.ensureConnected();
    lastPort().postMessage.mockImplementationOnce(() => {
      throw new Error('Message length exceeded maximum allowed length.');
    });

    expect(() => port.post({ type: 'huge' })).toThrow(/length exceeded/);
    expect(port.isConnected()).toBe(true);
  });

  it('gives up when the extension context is gone', () => {
    const { port, onGiveUp } = build();
    port.ensureConnected();

    Object.defineProperty(fake.runtime, 'id', { value: undefined });
    lastPort().dropFromOtherSide();
    vi.advanceTimersByTime(100);

    expect(fake.ports).toHaveLength(1);
    expect(onGiveUp).toHaveBeenCalledTimes(1);
    port.post({ type: 'late' });
    expect(fake.ports).toHaveLength(1);
  });

  it('disconnect() closes the port and cancels pending retries', () => {
    const { port } = build();
    port.ensureConnected();
    const first = lastPort();
    first.dropFromOtherSide();
    port.post({ type: 'queued' });

    port.disconnect();
    vi.advanceTimersByTime(1_000);
    expect(fake.ports).toHaveLength(1);

    port.ensureConnected();
    port.post({ type: 'after-close' });
    expect(fake.ports).toHaveLength(1);
  });

  it('disconnect() on an open port calls port.disconnect and ignores the resulting onDisconnect', () => {
    const { port } = build();
    port.ensureConnected();
    const first = lastPort();
    port.disconnect();
    expect(first.disconnect).toHaveBeenCalledTimes(1);
    first.dropFromOtherSide();
    vi.advanceTimersByTime(1_000);
    expect(fake.ports).toHaveLength(1);
  });
});
