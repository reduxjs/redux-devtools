import { combineReducers, Reducer } from 'redux';
import todos, { Todo } from './todos';
import { TodoAction } from '../actions/TodoActions';

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
