import expect from 'expect';
import devTools, {ActionCreators as DAC} from '../src/devTools';
import { createStore, compose } from 'redux';

const reducer = function counter(state = 0, action) {
  switch (action.type) {
  case 'INC':
    return state + 1;
  case 'DEC':
    return state - 1;
  default:
    return state;
  }
};


const createDevStore = () => compose(devTools(), createStore)(reducer);

describe('Recompute state', () => {

  describe('export/import', () => {
    let store;

    // helpters
    const getDevState = () => store.devToolsStore.getState();
    const dispatch = (action) => store.devToolsStore.dispatch(action);
    const recomputeExpectedState = (expState) => {
      dispatch(DAC.recomputeStates(
        expState.commitedState,
        expState.stagedActions,
        expState.timestamps,
        expState.currentStateIndex,
        expState.skippedActions
      ));
      return getDevState();
    };

    // create some timestamps
    beforeEach((done) => {
      store = createDevStore();
      setTimeout(() => store.dispatch({type: 'INC'}), 3);
      setTimeout(() => store.dispatch({type: 'INC'}), 6);
      setTimeout(() => {
        store.dispatch({type: 'INC'});
        done();
      }, 9);
    });

    it('should be possible to set the current index', () => {
      dispatch(DAC.jumpToState(1));
      const expState = getDevState();
      dispatch(DAC.jumpToState(2));
      const rcState = recomputeExpectedState(expState);

      expect(rcState.currentStateIndex).toBe(expState.currentStateIndex);
    });

    it('currentStateIndex should be optional', () => {
      const expState = getDevState();
      dispatch(DAC.jumpToState(1));
      const rcState = recomputeExpectedState({
        ...expState,
        currentStateIndex: undefined
      });

      expect(rcState.currentStateIndex).toBe(3);
    });

    it('should be possible to preserve skipped actions', () => {
      dispatch(DAC.toggleAction(1));
      const expState = getDevState();
      dispatch(DAC.toggleAction(2));
      const rcState = recomputeExpectedState(expState);

      expect(rcState.skippedActions).toBe(expState.skippedActions);
    });

    it('should preserve timestamps', () => {
      const expState = getDevState();
      const rcState = recomputeExpectedState(expState);

      expect(rcState.timestamps).toBe(expState.timestamps);
    });

  });

});
