import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
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
    {/* eslint-disable-next-line @typescript-eslint/unbound-method */}
    <Header addTodo={actions.addTodo} />
    <MainSection todos={todos} actions={actions} />
  </div>
);

TodoApp.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.any.isRequired,
};

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
