import { combineReducers } from 'redux';
import todos, { Todo } from './todos';

export interface TodoState {
  todos: Todo[];
}

const rootReducer = combineReducers({
  todos,
});

export default rootReducer;
