import expect from 'expect';
import { insertScript, listenMessage } from '../../utils/inject';
import '../../../src/browser/extension/inject/pageScript';

describe('API', () => {
  it('should get window.__REDUX_DEVTOOLS_EXTENSION__ function', () => {
    expect(window.__REDUX_DEVTOOLS_EXTENSION__).toBeA('function');
  });

  it('should notify error', () => {
    const spy = expect.createSpy(() => {});
    window.__REDUX_DEVTOOLS_EXTENSION__.notifyErrors(spy);
    insertScript('hi()');
    expect(spy).toHaveBeenCalled();
  });

  it('should open monitor', async () => {
    let message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.open();
    });
    expect(message).toEqual({ source: '@devtools-page', type: 'OPEN', position: 'right' });

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.open('left');
    });
    expect(message).toEqual({ source: '@devtools-page', type: 'OPEN', position: 'left' });
  });

  it('should send message', async () => {
    let message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send('hi');
    });
    expect(message).toInclude({
      type: 'ACTION',
      payload: undefined,
      instanceId: 1,
      name: undefined,
      source: '@devtools-page'
    });
    expect(message.action).toMatch(/{"action":{"type":"hi"},"timestamp":\d+}/);

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send({ type: 'hi' }, { counter: 1 }, 1);
    });
    expect(message).toInclude({
      type: 'ACTION',
      payload: '{"counter":1}',
      instanceId: 1,
      name: undefined,
      source: '@devtools-page'
    });
    expect(message.action).toMatch(/{"action":{"type":"hi"},"timestamp":\d+}/);

    message = await listenMessage(() => {
      window.__REDUX_DEVTOOLS_EXTENSION__.send({ type: 'hi' }, { counter: 1 }, 1);
    });
    expect(message).toInclude({
      type: 'ACTION',
      payload: '{"counter":1}',
      instanceId: 1,
      name: undefined,
      source: '@devtools-page'
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
      source: '@devtools-page'
    });
  });
});
