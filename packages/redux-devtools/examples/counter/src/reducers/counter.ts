import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../constants/ActionTypes';
import { CounterAction } from '../actions/CounterActions';

export default function counter(state = 0, action: CounterAction) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state + 1;
    case DECREMENT_COUNTER:
      return state - 1;
    default:
      return state;
  }
}
