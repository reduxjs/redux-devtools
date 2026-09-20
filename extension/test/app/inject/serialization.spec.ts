import { createStore, type Reducer } from 'redux';
import { describe, expect, it, vi } from 'vitest';
import { listenMessage } from '../../utils/inject.js';
import '../../../src/pageScript/index.js';

interface WireMessage {
  type: string;
  payload?: unknown;
  action?: string;
  actionsById?: string;
  computedStates?: string;
}

interface UnsafeState {
  value: number;
  explosive?: { readonly bad: never };
}

const explosive = {
  get bad(): never {
    throw new Error('boom');
  },
};

const reducer: Reducer<UnsafeState> = (state = { value: 0 }, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, value: state.value + 1 };
    case 'ARM':
      return { ...state, explosive };
    case 'DISARM': {
      const { explosive: _explosive, ...rest } = state;
      return rest;
    }
    default:
      return state;
  }
};

function nextMessage(type: string, trigger?: () => void) {
  return new Promise<WireMessage>((resolve) => {
    const listener = (event: MessageEvent<WireMessage>) => {
      if (event.data?.type !== type) return;
      window.removeEventListener('message', listener);
      resolve(event.data);
    };
    window.addEventListener('message', listener);
    trigger?.();
  });
}

function startMonitoring() {
  return nextMessage('STATE', () => {
    window.postMessage({ type: 'START', source: '@devtools-extension' }, '*');
  });
}

describe('page script serialization', () => {
  it('serializes BigInt values as strings with an n suffix', async () => {
    const message = (await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send(
        { type: 'hi', big: 5n },
        { counter: 10n, nested: { deep: -7n } },
        1,
      );
    })) as WireMessage;
    expect(message.type).toBe('ACTION');
    expect(message.payload).toBe('{"counter":"10n","nested":{"deep":"-7n"}}');
    expect(message.action).toContain('"big":"5n"');
  });

  it('serializes BigInt values when a custom serialize replacer is configured', async () => {
    const store = createStore(
      (state: { big: bigint; date?: Date } = { big: 1n }, action) =>
        action.type === 'SET' ? { big: 2n, date: new Date(0) } : state,
      window.__REDUX_DEVTOOLS_EXTENSION__({
        serialize: {
          replacer: (key, value) =>
            value instanceof Date ? `date:${value.toISOString()}` : value,
        },
      }),
    );
    const state = await startMonitoring();
    expect(state.computedStates).toBe('[{"state":{"big":"1n"}}]');

    const message = await nextMessage('ACTION', () => {
      store.dispatch({ type: 'SET' });
    });
    expect(message.payload).toBe(
      '{"big":"2n","date":"date:1970-01-01T00:00:00.000Z"}',
    );
  });

  it('reports a serialization failure to the panel instead of throwing from dispatch', async () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__());
    await startMonitoring();

    const errorMessage = await nextMessage('ERROR', () => {
      expect(() => store.dispatch({ type: 'ARM' })).not.toThrow();
    });
    expect(errorMessage.payload).toMatch(
      /could not serialize the ACTION message: boom/,
    );
    expect(store.getState().explosive).toBe(explosive);

    const recovered = await nextMessage('ACTION', () => {
      store.dispatch({ type: 'DISARM' });
    });
    expect(recovered.payload).toBe('{"value":0}');
    consoleError.mockRestore();
  });
});
