import { createStore } from 'redux';
import type { TodoState } from '../reducers';
import rootReducer from '../reducers';

export default function configureStore(initialState?: Partial<TodoState>) {
  return createStore(rootReducer, initialState);
}
