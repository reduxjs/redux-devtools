import { REHYDRATE } from 'redux-persist';
import { monitor, MonitorState } from '../src/reducers/monitor.js';
import { CoreStoreAction } from '../src/actions/index.js';

const rehydrate = (persisted: MonitorState): CoreStoreAction =>
  ({
    type: REHYDRATE,
    key: 'redux-devtools',
    payload: { monitor: persisted },
  }) as unknown as CoreStoreAction;

describe('monitor reducer REHYDRATE', () => {
  it('clears selection and drilled-in paths but keeps the tab', () => {
    const persisted: MonitorState = {
      selected: 'InspectorMonitor',
      sliderIsOpen: true,
      dispatcherIsOpen: false,
      monitorState: {
        tabName: 'Trace',
        selectedActionId: 3,
        startActionId: 1,
        inspectedActionPath: ['payload', 'user'],
        inspectedStatePath: ['todos', '0'],
      },
    };

    const next = monitor(undefined, rehydrate(persisted));

    expect(next.selected).toBe('InspectorMonitor');
    expect(next.monitorState).toEqual({
      tabName: 'Trace',
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: [],
      inspectedStatePath: [],
    });
  });

  it('keeps the default state when nothing was persisted for monitor', () => {
    const initial = monitor(undefined, {
      type: '@@INIT',
    } as unknown as CoreStoreAction);
    const next = monitor(initial, {
      type: REHYDRATE,
      key: 'redux-devtools',
      payload: undefined,
    } as unknown as CoreStoreAction);
    expect(next).toBe(initial);
  });
});
