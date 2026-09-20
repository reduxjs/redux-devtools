import { vi } from 'vitest';

type Listener<T extends unknown[]> = (...args: T) => void;

class FakeEvent<T extends unknown[]> {
  private listeners = new Set<Listener<T>>();
  addListener = (fn: Listener<T>) => {
    this.listeners.add(fn);
  };
  removeListener = (fn: Listener<T>) => {
    this.listeners.delete(fn);
  };
  hasListener = (fn: Listener<T>) => this.listeners.has(fn);
  hasListeners = () => this.listeners.size > 0;
  emit(...args: T) {
    for (const fn of [...this.listeners]) fn(...args);
  }
}

export interface FakePort {
  readonly name: string;
  readonly onMessage: FakeEvent<[unknown, FakePort]>;
  readonly onDisconnect: FakeEvent<[FakePort]>;
  readonly postMessage: ReturnType<typeof vi.fn<(message: unknown) => void>>;
  readonly disconnect: ReturnType<typeof vi.fn<() => void>>;
  readonly sent: unknown[];
  /** Simulate the other side sending a message down this port. */
  receive(message: unknown): void;
  /** Simulate the other side going away (background worker terminated). */
  dropFromOtherSide(): void;
}

export function createFakePort(name: string): FakePort {
  const sent: unknown[] = [];
  const port: FakePort = {
    name,
    onMessage: new FakeEvent<[unknown, FakePort]>(),
    onDisconnect: new FakeEvent<[FakePort]>(),
    sent,
    postMessage: vi.fn<(message: unknown) => void>((message) => {
      sent.push(message);
    }),
    disconnect: vi.fn<() => void>(),
    receive(message) {
      port.onMessage.emit(message, port);
    },
    dropFromOtherSide() {
      port.onDisconnect.emit(port);
    },
  };
  return port;
}

export interface FakeChrome {
  readonly runtime: {
    readonly connect: ReturnType<
      typeof vi.fn<(...args: unknown[]) => FakePort>
    >;
    readonly onConnect: FakeEvent<[FakePort]>;
    readonly onMessage: FakeEvent<[unknown]>;
    readonly id: string;
  };
  readonly storage: {
    readonly sync: {
      readonly get: <T>(defaults: T, cb: (items: T) => void) => void;
      readonly set: ReturnType<typeof vi.fn<(items: unknown) => void>>;
    };
    readonly local: {
      readonly get: <T>(defaults: T, cb: (items: T) => void) => void;
      readonly set: ReturnType<typeof vi.fn<(items: unknown) => void>>;
    };
  };
  /** Every port handed out by `runtime.connect`, in order. */
  readonly ports: FakePort[];
}

export function createFakeChrome(
  storedOptions: Record<string, unknown> = {},
): FakeChrome {
  const ports: FakePort[] = [];
  const storageGet = <T>(defaults: T, cb: (items: T) => void) => {
    cb({ ...(defaults as Record<string, unknown>), ...storedOptions } as T);
  };
  const storageArea = {
    get: storageGet,
    set: vi.fn<(items: unknown) => void>(),
  };
  return {
    runtime: {
      id: 'fake-extension-id',
      connect: vi.fn<(...args: unknown[]) => FakePort>((...args) => {
        const info = args.find(
          (a): a is { name: string } =>
            typeof a === 'object' && a !== null && 'name' in a,
        );
        const port = createFakePort(info?.name ?? '');
        ports.push(port);
        return port;
      }),
      onConnect: new FakeEvent<[FakePort]>(),
      onMessage: new FakeEvent<[unknown]>(),
    },
    storage: { sync: storageArea, local: storageArea },
    ports,
  };
}

export function installFakeChrome(fake: FakeChrome) {
  Object.defineProperty(globalThis, 'chrome', {
    value: fake,
    configurable: true,
    writable: true,
  });
}

export const nextTick = () => new Promise<void>((r) => setTimeout(r, 0));
