import { describe, expect, it } from 'vitest';
import importState from '../../../src/pageScript/api/importState.js';

const liftedState = JSON.stringify({
  actionsById: {},
  computedStates: [{ state: { when: 'date:1970-01-01T00:00:00.000Z' } }],
  currentStateIndex: 0,
  nextActionId: 1,
  skippedActionIds: [],
  stagedActionIds: [0],
});

const reviver = (key: string, value: unknown) =>
  typeof value === 'string' && value.startsWith('date:')
    ? new Date(value.slice(5))
    : value;

describe('importState', () => {
  it('applies the user reviver when serialize has a reviver but no immutable', () => {
    const result = importState<{ when: Date }, { type: string }>(liftedState, {
      serialize: { reviver },
    });
    expect(result?.nextLiftedState.computedStates[0].state.when).toEqual(
      new Date(0),
    );
  });

  it('parses plainly when serialize is true', () => {
    const result = importState<{ when: string }, { type: string }>(
      liftedState,
      { serialize: true },
    );
    expect(result?.nextLiftedState.computedStates[0].state.when).toBe(
      'date:1970-01-01T00:00:00.000Z',
    );
  });
});
