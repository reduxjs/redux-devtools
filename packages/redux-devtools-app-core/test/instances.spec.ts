import { instances, InstancesState } from '../src/reducers/instances.js';
import { REMOVE_INSTANCE } from '../src/constants/actionTypes.js';

const liftedState = {
  actionsById: {},
  computedStates: [],
  currentStateIndex: -1,
  nextActionId: 0,
  skippedActionIds: [],
  stagedActionIds: [],
};

describe('instances reducer REMOVE_INSTANCE', () => {
  it('keeps the persist setting when an instance is removed', () => {
    const state: InstancesState = {
      selected: null,
      current: '1/1',
      sync: false,
      persisted: true,
      connections: { 1: ['1/1'], 2: ['2/1'] },
      options: {
        '1/1': { features: {} },
        '2/1': { features: {} },
      },
      states: { '1/1': liftedState, '2/1': liftedState },
    };

    const next = instances(state, { type: REMOVE_INSTANCE, id: 1 });

    expect(next.persisted).toBe(true);
    expect(next.current).toBe('2/1');
    expect(next.connections).toEqual({ 2: ['2/1'] });
    expect(Object.keys(next.states)).toEqual(['2/1']);
  });
});
