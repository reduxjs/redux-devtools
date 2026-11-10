import type { Reducer } from 'redux';
import { combineReducers } from 'redux';
import type { Todo } from './todos';
import todos from './todos';
import type { TodoAction } from '../actions/TodoActions';

export interface TodoState {
  todos: Todo[];
}

const rootReducer: Reducer<
  TodoState,
  TodoAction,
  Partial<TodoState>
> = combineReducers({
  todos,
}) as any;

export default rootReducer;
