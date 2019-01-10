import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_MARKED, SHOW_UNMARKED } from '../constants/TodoFilters';

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_UNMARKED]: todo => !todo.marked,
  [SHOW_MARKED]: todo => todo.marked
};

export default class MainSection extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };
  // Keep a counter that can be used to create an html `id` attribute.
  static mountCount = 0;

  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
    this.htmlFormInputId = `toggle-all-${MainSection.mountCount++}`;
  }

  handleClearMarked() {
    const atLeastOneMarked = this.props.todos.some(todo => todo.marked);
    if (atLeastOneMarked) {
      this.props.actions.clearMarked();
    }
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    const filteredTodos = todos.filter(TODO_FILTERS[filter]);
    const markedCount = todos.reduce(
      (count, todo) => (todo.marked ? count + 1 : count),
      0
    );

    return (
      <section className="main">
        {this.renderToggleAll(markedCount)}
        <ul className="todo-list">
          {filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} {...actions} />
          ))}
        </ul>
        {this.renderFooter(markedCount)}
      </section>
    );
  }

  renderToggleAll(markedCount) {
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

  renderFooter(markedCount) {
    const { todos } = this.props;
    const { filter } = this.state;
    const unmarkedCount = todos.length - markedCount;

    if (todos.length) {
      return (
        <Footer
          markedCount={markedCount}
          unmarkedCount={unmarkedCount}
          filter={filter}
          onClearMarked={::this.handleClearMarked}
          onShow={::this.handleShow}
        />
      );
    }
  }
}
