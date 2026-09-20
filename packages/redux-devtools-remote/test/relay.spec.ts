import { createStore, type Action, type Reducer } from 'redux';

interface Transmitted {
  event: string;
  data: { type: string; payload?: string; action?: string };
}

class AsyncQueue<T> implements AsyncIterable<T> {
  private items: T[] = [];
  private waiters: ((value: T) => void)[] = [];

  push(item: T) {
    const waiter = this.waiters.shift();
    if (waiter) waiter(item);
    else this.items.push(item);
  }

  async *[Symbol.asyncIterator]() {
    while (true) {
      const item = this.items.shift();
      if (item !== undefined) yield item;
      else yield await new Promise<T>((resolve) => this.waiters.push(resolve));
    }
  }
}

function createFakeSocket() {
  const listeners = new Map<string, AsyncQueue<unknown>>();
  const channel = new AsyncQueue<unknown>();
  const transmitted: Transmitted[] = [];
  const listener = (name: string) => {
    let queue = listeners.get(name);
    if (!queue) {
      queue = new AsyncQueue<unknown>();
      listeners.set(name, queue);
    }
    return queue;
  };
  return {
    id: 'socket-1',
    CONNECTING: 'connecting',
    transmitted,
    getState: () => 'open',
    listener,
    invoke: async () => 'channel-1',
    subscribe: () => channel,
    unsubscribe: async () => {},
    closeChannel: () => {},
    disconnect: () => {},
    transmit: async (event: string, data: Transmitted['data']) => {
      transmitted.push({ event, data });
    },
    emit: (name: string, data: unknown) => listener(name).push(data),
    receive: (message: unknown) => channel.push(message),
  };
}

let fakeSocket = createFakeSocket();

vi.mock('socketcluster-client', () => ({
  default: { create: () => fakeSocket },
}));

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

interface SetValue extends Action<'SET_VALUE'> {
  value: unknown;
}

const reducer: Reducer<{ value: unknown }, SetValue> = (
  state = { value: null },
  action,
) => (action.type === 'SET_VALUE' ? { value: action.value } : state);

async function setupMonitoredStore() {
  fakeSocket = createFakeSocket();
  const { default: devTools } = await import('../src/devTools.js');
  const store = createStore(
    reducer,
    devTools<{ value: unknown }, SetValue, { value: unknown }>({
      realtime: true,
    }),
  );
  fakeSocket.emit('connect', {});
  await flush();
  fakeSocket.receive({ type: 'START' });
  await flush();
  fakeSocket.transmitted.length = 0;
  return store;
}

describe('remote relay serialization', () => {
  it('serializes BigInt in state and action as "<digits>n" strings', async () => {
    const store = await setupMonitoredStore();

    store.dispatch({ type: 'SET_VALUE', value: 42n });
    await flush();

    const message = fakeSocket.transmitted.find(
      (t) => t.data.type === 'ACTION',
    );
    expect(message).toBeDefined();
    expect(JSON.parse(message!.data.payload!)).toEqual({ value: '42n' });
    expect(JSON.parse(message!.data.action!).action).toEqual({
      type: 'SET_VALUE',
      value: '42n',
    });
  });

  it('keeps circular references as jsan refs', async () => {
    const store = await setupMonitoredStore();
    const circular: { self?: unknown } = {};
    circular.self = circular;

    store.dispatch({ type: 'SET_VALUE', value: circular });
    await flush();

    const message = fakeSocket.transmitted.find(
      (t) => t.data.type === 'ACTION',
    );
    expect(message!.data.payload).toContain('$jsan');
  });

  it('sends an ERROR message instead of throwing when serialization fails', async () => {
    const store = await setupMonitoredStore();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const poison = {
      get boom(): string {
        throw new Error('cannot read boom');
      },
    };

    expect(() =>
      store.dispatch({ type: 'SET_VALUE', value: poison }),
    ).not.toThrow();
    await flush();

    const types = fakeSocket.transmitted.map((t) => t.data.type);
    expect(types).not.toContain('ACTION');
    const error = fakeSocket.transmitted.find((t) => t.data.type === 'ERROR');
    expect(error!.data.payload).toBe(
      'Redux DevTools could not serialize the ACTION message: cannot read boom',
    );
    consoleError.mockRestore();
  });
});
