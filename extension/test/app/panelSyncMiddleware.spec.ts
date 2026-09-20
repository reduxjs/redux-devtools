import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  SELECT_INSTANCE,
  UPDATE_STATE,
  type StoreAction,
  type StoreState,
} from '@redux-devtools/app';
import type { Dispatch, MiddlewareAPI } from 'redux';
import panelDispatcher from '../../src/devpanel/store/panelSyncMiddleware.js';

const inspectedTabId = 7;

type Instances = StoreState['instances'];

function makeInstances(overrides: Partial<Instances>): Instances {
  return {
    selected: null,
    current: 'default',
    sync: false,
    persisted: false,
    connections: {},
    options: {},
    states: {},
    ...overrides,
  } as Instances;
}

function setup(initial: Instances) {
  let instances = initial;
  const seen: StoreAction[] = [];
  const store = {
    getState: () => ({ instances }) as StoreState,
    dispatch: ((a: StoreAction) => a) as Dispatch<StoreAction>,
  } as MiddlewareAPI<Dispatch<StoreAction>, StoreState>;
  const next = (action: unknown) => {
    seen.push(action as StoreAction);
    return action;
  };
  const port = { post: () => {} };
  const dispatch = panelDispatcher(port)(store)(next);
  return {
    seen,
    dispatch,
    setInstances: (next: Instances) => {
      instances = next;
    },
  };
}

const updateState = (id: number, instanceId: string): StoreAction =>
  ({
    type: UPDATE_STATE,
    id,
    request: { type: 'ACTION', instanceId, id: String(id) },
  }) as unknown as StoreAction;

const selections = (seen: StoreAction[]) =>
  seen
    .filter((a) => a.type === SELECT_INSTANCE)
    .map((a) => (a as { selected: string }).selected);

describe('panelSyncMiddleware instance pinning', () => {
  beforeEach(() => {
    vi.stubGlobal('chrome', {
      devtools: { inspectedWindow: { tabId: inspectedTabId } },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('pins to the inspected tab even when another tab dispatched first', () => {
    const { seen, dispatch, setInstances } = setup(
      makeInstances({ current: '9/1', connections: { 9: ['9/1'] } }),
    );

    dispatch(updateState(9, '9/1'));
    expect(selections(seen)).toEqual([]);

    setInstances(
      makeInstances({
        current: '7/1',
        connections: { 9: ['9/1'], 7: ['7/1'] },
      }),
    );
    dispatch(updateState(7, '7/1'));
    expect(selections(seen)).toEqual(['7/1']);
  });

  it('re-pins after the inspected page reloads and its instance is replaced', () => {
    const { seen, dispatch, setInstances } = setup(
      makeInstances({ current: '7/1', connections: { 7: ['7/1'] } }),
    );
    dispatch(updateState(7, '7/1'));
    expect(selections(seen)).toEqual(['7/1']);

    setInstances(
      makeInstances({
        selected: null,
        current: '7/2',
        connections: { 7: ['7/2'], 9: ['9/1'] },
      }),
    );
    dispatch(updateState(7, '7/2'));
    expect(selections(seen)).toEqual(['7/1', '7/2']);
  });

  it('does not re-pin while an instance is already selected', () => {
    const { seen, dispatch } = setup(
      makeInstances({
        selected: '9/1',
        current: '7/1',
        connections: { 7: ['7/1'], 9: ['9/1'] },
      }),
    );
    dispatch(updateState(7, '7/1'));
    expect(selections(seen)).toEqual([]);
  });

  it('pins to a store living in an iframe of the inspected tab', () => {
    const { seen, dispatch } = setup(
      makeInstances({
        current: '7-3/1',
        connections: { '7-3': ['7-3/1'], 9: ['9/1'] },
      }),
    );
    dispatch(updateState(7, '7-3/1'));
    expect(selections(seen)).toEqual(['7-3/1']);
  });

  it('prefers the top-frame store when iframes also have stores', () => {
    const { seen, dispatch } = setup(
      makeInstances({
        current: '7/1',
        connections: { 7: ['7/1'], '7-3': ['7-3/1'] },
      }),
    );
    dispatch(updateState(7, '7/1'));
    expect(selections(seen)).toEqual(['7/1']);
  });

  it('does not guess between several iframe stores', () => {
    const { seen, dispatch } = setup(
      makeInstances({
        current: '7-3/1',
        connections: { '7-3': ['7-3/1'], '7-4': ['7-4/1'] },
      }),
    );
    dispatch(updateState(7, '7-3/1'));
    expect(selections(seen)).toEqual([]);
  });

  it('does not match a tab whose id merely starts with the same digits', () => {
    const { seen, dispatch } = setup(
      makeInstances({
        current: '71/1',
        connections: { 71: ['71/1'], '71-2': ['71-2/1'] },
      }),
    );
    dispatch(updateState(71, '71/1'));
    expect(selections(seen)).toEqual([]);
  });

  it('respects an explicit "Autoselect instances" choice', () => {
    const { seen, dispatch } = setup(
      makeInstances({ current: '7/1', connections: { 7: ['7/1'] } }),
    );
    dispatch({ type: SELECT_INSTANCE, selected: '' } as StoreAction);
    dispatch(updateState(7, '7/1'));
    expect(selections(seen)).toEqual(['']);
  });
});
