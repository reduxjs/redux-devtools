import { createStore, applyMiddleware, PreloadedState } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { CounterState } from '../reducers';

const enhancer = applyMiddleware(thunk);

export default function configureStore(
  initialState?: PreloadedState<CounterState>,
) {
  return createStore(rootReducer, initialState, enhancer);
}
