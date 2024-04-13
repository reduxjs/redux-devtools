import React, { Component, MouseEventHandler } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import {
  SHOW_ALL,
  SHOW_MARKED,
  SHOW_UNMARKED,
  TodoFilter,
} from '../constants/TodoFilters';
import { Todo } from '../reducers/todos';
import { TodoActions } from '../actions/TodoActions';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_UNMARKED]: (todo: Todo) => !todo.marked,
  [SHOW_MARKED]: (todo: Todo) => todo.marked,
};

interface State {
  filter: TodoFilter;
}

interface Props {
  todos: Todo[];
  actions: TodoActions;
}

export default class MainSection extends Component<Props, State> {
  // Keep a counter that can be used to create an html `id` attribute.
  static mountCount = 0;

  state: State = { filter: SHOW_ALL };
  htmlFormInputId = `toggle-all-${MainSection.mountCount++}`;

  handleClearMarked: MouseEventHandler<HTMLButtonElement> = () => {
    const atLeastOneMarked = this.props.todos.some((todo) => todo.marked);
    if (atLeastOneMarked) {
      this.props.actions.clearMarked();
    }
  };

  handleShow = (filter: TodoFilter) => {
    this.setState({ filter });
  };

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const markedCount = todos.reduce(
      (count, todo) => (todo.marked ? count + 1 : count),
      0,
    );

    return (
      <section className="main">
        {this.renderToggleAll(markedCount)}
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} {...actions} />
          ))}
        </ul>
        {this.renderFooter(markedCount)}
      </section>
    );
  }

  renderToggleAll(markedCount: number) {
    const { todos, actions } = this.props;

    if (todos.length > 0) {
      return (
        <div>
          <input
            id={this.htmlFormInputId}
            className="toggle-all"
            type="checkbox"
            checked={markedCount === todos.length}
            onChange={actions.markAll}
          />
          <label htmlFor={this.htmlFormInputId}>Mark all as complete</label>
        </div>
      );
    }
  }

  renderFooter(markedCount: number) {
    const { todos } = this.props;
    const { filter } = this.state;
    const unmarkedCount = todos.length - markedCount;

    if (todos.length) {
      return (
        <Footer
          markedCount={markedCount}
          unmarkedCount={unmarkedCount}
          filter={filter}
          onClearMarked={this.handleClearMarked}
          onShow={this.handleShow}
        />
      );
    }
  }
}
