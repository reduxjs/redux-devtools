import type { Middleware } from 'redux';
import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import type { CounterState } from '../reducers';
import rootReducer from '../reducers';

const enhancer = applyMiddleware(thunk as unknown as Middleware);

export default function configureStore(initialState?: Partial<CounterState>) {
  return createStore(rootReducer, initialState, enhancer);
}
