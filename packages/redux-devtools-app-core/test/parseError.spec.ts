import { createStore, applyMiddleware, combineReducers, Reducer } from 'redux';
import { coreReducers } from '../src/reducers/index.js';
import { parseErrorMiddleware } from '../src/middlewares/parseError.js';
import parseJSON, { ParseJSONError } from '../src/utils/parseJSON.js';
import { UPDATE_STATE, LIFTED_ACTION } from '../src/constants/actionTypes.js';
import type { CoreStoreAction, CoreStoreState } from '../src/index.js';

const createTestStore = () =>
  createStore(
    combineReducers(coreReducers) as Reducer<
      CoreStoreState,
      CoreStoreAction,
      Partial<CoreStoreState>
    >,
    applyMiddleware(parseErrorMiddleware),
  );

const initRequest: CoreStoreAction = {
  type: UPDATE_STATE,
  request: {
    type: 'INIT',
    id: 'conn-1',
    instanceId: 1,
    payload: JSON.stringify({ count: 0 }),
  },
};

describe('parseJSON', () => {
  it('throws ParseJSONError on malformed input', () => {
    expect(() => parseJSON('{not json')).toThrow(ParseJSONError);
  });

  it('passes non-string input through', () => {
    const obj = { a: 1 };
    expect(parseJSON(obj as unknown as string)).toBe(obj);
    expect(parseJSON(undefined)).toBeUndefined();
  });
});

describe('parseErrorMiddleware', () => {
  it('keeps the previous instance state and shows a notification on a malformed payload', () => {
    const store = createTestStore();
    store.dispatch(initRequest);
    const before = store.getState().instances.states[1];
    expect(before.computedStates).toEqual([{ state: { count: 0 } }]);

    store.dispatch({
      type: UPDATE_STATE,
      request: {
        type: 'ACTION',
        id: 'conn-1',
        instanceId: 1,
        action: '{"type":"INCREMENT"}',
        payload: '{"count":1',
        nextActionId: 2,
        maxAge: 50,
      },
    });

    expect(store.getState().instances.states[1]).toBe(before);
    expect(store.getState().notification).toEqual({
      type: 'error',
      message: expect.stringContaining('Failed to parse'),
    });
  });

  it('shows a notification when an imported state is malformed', () => {
    const store = createTestStore();
    store.dispatch({
      type: UPDATE_STATE,
      request: {
        type: 'INIT',
        id: 'conn-1',
        instanceId: 1,
        payload: JSON.stringify({ count: 0 }),
        libConfig: { features: { import: true } },
      },
    });
    const before = store.getState().instances.states[1];

    store.dispatch({
      type: LIFTED_ACTION,
      message: 'IMPORT',
      state: '{"broken":',
      preloadedState: undefined,
    });

    expect(store.getState().instances.states[1]).toBe(before);
    expect(store.getState().notification?.type).toBe('error');
  });

  it('rethrows errors that are not parse failures', () => {
    const throwing: Reducer<CoreStoreState, CoreStoreAction> = (
      state,
      action,
    ) => {
      if (action.type === UPDATE_STATE) throw new Error('boom');
      return state as CoreStoreState;
    };
    const store = createStore(throwing, applyMiddleware(parseErrorMiddleware));
    expect(() => store.dispatch(initRequest)).toThrow('boom');
  });
});
