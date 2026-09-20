import { describe, expect, it } from 'vitest';
import { createStore, type Reducer } from 'redux';
import '../../../src/pageScript/index.js';

const counter: Reducer<number> = (state = 0) => state;

const nextTick = () => new Promise<void>((r) => setTimeout(r, 0));

function pushOptions(options: Record<string, unknown>) {
  window.postMessage(
    { type: 'OPTIONS', options, id: undefined, source: '@devtools-extension' },
    '*',
  );
  return nextTick();
}

describe('page script honours the allow list before the first store', () => {
  it('stores extension options pushed before any store exists', async () => {
    await pushOptions({ inject: false, urls: '^https?://allowed\\.example' });
    expect(window.devToolsOptions).toMatchObject({
      inject: false,
      urls: '^https?://allowed\\.example',
    });
  });

  it('does not instrument the first store on a denied host', () => {
    const store = createStore(counter, window.__REDUX_DEVTOOLS_EXTENSION__());
    expect('liftedStore' in store).toBe(false);
  });

  it('instruments once the host is allowed', async () => {
    await pushOptions({ urls: `^${location.origin.replace(/\./g, '\\.')}` });
    const store = createStore(counter, window.__REDUX_DEVTOOLS_EXTENSION__());
    expect('liftedStore' in store).toBe(true);
  });
});
