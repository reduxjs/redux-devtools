import { createStore, PreloadedState } from 'redux';
import rootReducer, { TodoState } from '../reducers';

export default function configureStore(
  initialState?: PreloadedState<TodoState>,
) {
  return createStore(rootReducer, initialState);
}
