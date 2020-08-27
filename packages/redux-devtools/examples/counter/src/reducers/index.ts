import { combineReducers } from 'redux';
import counter from './counter';

const rootReducer = combineReducers({
  counter,
});

export interface CounterState {
  counter: number;
}

export default rootReducer;
