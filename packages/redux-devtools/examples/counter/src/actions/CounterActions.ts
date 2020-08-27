import { ThunkAction } from 'redux-thunk';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';
import { CounterState } from '../reducers';

interface IncrementCounterAction {
  type: typeof INCREMENT_COUNTER;
}
export function increment(): IncrementCounterAction {
  return {
    type: INCREMENT_COUNTER,
  };
}

interface DecrementCounterAction {
  type: typeof DECREMENT_COUNTER;
}
export function decrement(): DecrementCounterAction {
  return {
    type: DECREMENT_COUNTER,
  };
}

export type CounterAction = IncrementCounterAction | DecrementCounterAction;

export function incrementIfOdd(): ThunkAction<
  void,
  CounterState,
  never,
  CounterAction
> {
  return (dispatch, getState) => {
    const { counter } = getState();

    if (counter % 2 === 0) {
      return;
    }

    dispatch(increment());
  };
}

export function incrementAsync(): ThunkAction<
  void,
  CounterState,
  never,
  CounterAction
> {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(increment());
    }, 1000);
  };
}
