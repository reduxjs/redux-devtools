import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/TodoActions';
import {
  TodoAction,
  TodoActions as TodoActionsType,
} from '../actions/TodoActions';
import { TodoState } from '../reducers';
import { Todo } from '../reducers/todos';

interface Props {
  todos: Todo[];
  actions: TodoActionsType;
}

const TodoApp: FunctionComponent<Props> = ({ todos, actions }) => (
  <div>
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />
  </div>
);

function mapState(state: TodoState) {
  return {
    todos: state.todos,
  };
}

function mapDispatch(dispatch: Dispatch<TodoAction>) {
  return {
    actions: bindActionCreators(TodoActions, dispatch),
  };
}

export default connect(mapState, mapDispatch)(TodoApp);
