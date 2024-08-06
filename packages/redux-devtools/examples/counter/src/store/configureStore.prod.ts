import { createStore, applyMiddleware, Middleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { CounterState } from '../reducers';

const enhancer = applyMiddleware(thunk as unknown as Middleware);

export default function configureStore(initialState?: Partial<CounterState>) {
  return createStore(rootReducer, initialState, enhancer);
}
