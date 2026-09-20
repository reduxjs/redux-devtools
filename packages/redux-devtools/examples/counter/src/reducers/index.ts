import { combineReducers, Reducer } from 'redux';
import counter from './counter';
import { CounterAction } from '../actions/CounterActions';

const rootReducer: Reducer<
  CounterState,
  CounterAction,
  Partial<CounterState>
> = combineReducers({
  counter,
}) as any;

export interface CounterState {
  counter: number;
}

export default rootReducer;
