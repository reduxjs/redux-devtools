import { vi } from 'vitest';
import { connect } from '../../../src/pageScript/api/index.js';

function messageFromExtension(data: Record<string, unknown>) {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { source: '@devtools-extension', ...data },
    }),
  );
}

function nextLiftedMessage(instanceId: number) {
  return new Promise<unknown>((resolve) => {
    const listener = (event: MessageEvent) => {
      const message = event.data;
      if (
        message?.source !== '@devtools-page' ||
        message.type !== 'LIFTED' ||
        message.instanceId !== instanceId
      )
        return;
      clearTimeout(timer);
      window.removeEventListener('message', listener);
      resolve(message);
    };
    const timer = setTimeout(() => {
      window.removeEventListener('message', listener);
      resolve(null);
    }, 1000);
    window.addEventListener('message', listener);
  });
}

describe('connect().subscribe', () => {
  it('keeps other listeners when unsubscribe is called twice', () => {
    const devTools = connect({ instanceId: 101 });
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = devTools.subscribe(first)!;
    devTools.subscribe(second);

    unsubscribeFirst();
    unsubscribeFirst();

    messageFromExtension({ type: 'START', id: '101' });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    devTools.unsubscribe();
  });

  it('keeps the internal pause listener when unsubscribe is called twice', async () => {
    const devTools = connect({ instanceId: 102 });
    const unsubscribe = devTools.subscribe(vi.fn())!;

    unsubscribe();
    unsubscribe();

    const lifted = nextLiftedMessage(102);
    messageFromExtension({
      type: 'DISPATCH',
      id: '102',
      payload: { type: 'PAUSE_RECORDING', status: true },
    });

    await expect(lifted).resolves.toMatchObject({
      type: 'LIFTED',
      liftedState: { isPaused: true },
    });
    devTools.unsubscribe();
  });
});
