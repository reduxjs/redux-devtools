import { insertScript, listenMessage } from '../../utils/inject';
import '../../../src/pageScript';

describe('API', () => {
  it('should get window.__REDUX_DEVTOOLS_EXTENSION__ function', () => {
    expect(typeof window.__REDUX_DEVTOOLS_EXTENSION__).toBe('function');
  });

  it('should notify error', () => {
    const mockFunc = jest.fn(() => {});
    window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors(mockFunc);
    insertScript('hi()');
    expect(mockFunc.mock.calls.length).toBeGreaterThan(0);
  });

  it('should open monitor', async () => {
    let message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.open();
    });
    expect(message).toEqual({
      source: '@devtools-page',
      type: 'OPEN',
      position: 'window',
    });
  });

  it('should send message', async () => {
    let message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send('hi');
    });
    expect(message).toMatchObject({
      type: 'ACTION',
      payload: undefined,
      instanceId: 1,
      name: undefined,
      source: '@devtools-page',
    });
    expect(message.action).toMatch(/{"action":{"type":"hi"},"timestamp":\d+}/);

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send(
        { type: 'hi' },
        { counter: 1 },
        1,
      );
    });
    expect(message).toMatchObject({
      type: 'ACTION',
      payload: '{"counter":1}',
      instanceId: 1,
      name: undefined,
      source: '@devtools-page',
    });
    expect(message.action).toMatch(/{"action":{"type":"hi"},"timestamp":\d+}/);

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send(
        { type: 'hi' },
        { counter: 1 },
        1,
      );
    });
    expect(message).toMatchObject({
      type: 'ACTION',
      payload: '{"counter":1}',
      instanceId: 1,
      name: undefined,
      source: '@devtools-page',
    });
    expect(message.action).toMatch(/{"action":{"type":"hi"},"timestamp":\d+}/);

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send(undefined, { counter: 1 }, 1);
    });
    expect(message).toEqual({
      action: undefined,
      type: 'STATE',
      payload: { counter: 1 },
      actionsById: undefined,
      computedStates: undefined,
      committedState: false,
      instanceId: 1,
      maxAge: undefined,
      name: undefined,
      source: '@devtools-page',
    });
  });
});
