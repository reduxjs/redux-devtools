import * as types from '../constants/ActionTypes';

interface AddTodoAction {
  type: typeof types.ADD_TODO;
  text: string;
}
export function addTodo(text: string): AddTodoAction {
  return {
    type: types.ADD_TODO,
    text,
  };
}

interface DeleteTodoAction {
  type: typeof types.DELETE_TODO;
  id: number;
}
export function deleteTodo(id: number): DeleteTodoAction {
  return {
    type: types.DELETE_TODO,
    id,
  };
}

interface EditTodoAction {
  type: typeof types.EDIT_TODO;
  id: number;
  text: string;
}
export function editTodo(id: number, text: string): EditTodoAction {
  return {
    type: types.EDIT_TODO,
    id,
    text,
  };
}

interface MarkTodoAction {
  type: typeof types.MARK_TODO;
  id: number;
}
export function markTodo(id: number): MarkTodoAction {
  return {
    type: types.MARK_TODO,
    id,
  };
}

interface MarkAllAction {
  type: typeof types.MARK_ALL;
}
export function markAll(): MarkAllAction {
  return {
    type: types.MARK_ALL,
  };
}

interface ClearMarkedAction {
  type: typeof types.CLEAR_MARKED;
}
export function clearMarked(): ClearMarkedAction {
  return {
    type: types.CLEAR_MARKED,
  };
}

export type TodoAction =
  | AddTodoAction
  | DeleteTodoAction
  | EditTodoAction
  | MarkTodoAction
  | MarkAllAction
  | ClearMarkedAction;

export interface TodoActions {
  addTodo(this: void, text: string): AddTodoAction;
  deleteTodo(this: void, id: number): DeleteTodoAction;
  editTodo(this: void, id: number, text: string): EditTodoAction;
  markTodo(this: void, id: number): MarkTodoAction;
  markAll(this: void): MarkAllAction;
  clearMarked(this: void): ClearMarkedAction;
}
