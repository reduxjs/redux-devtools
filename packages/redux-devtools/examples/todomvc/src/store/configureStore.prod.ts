import { createStore } from 'redux';
import rootReducer, { TodoState } from '../reducers';

export default function configureStore(initialState?: Partial<TodoState>) {
  return createStore(rootReducer, initialState);
}
