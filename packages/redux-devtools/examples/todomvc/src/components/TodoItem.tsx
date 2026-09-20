import React, { Component } from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';
import { Todo } from '../reducers/todos';

interface State {
  editing: boolean;
}

interface Props {
  todo: Todo;
  addTodo: (text: string) => void;
  deleteTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  markTodo: (id: number) => void;
  markAll: () => void;
  clearMarked: () => void;
}

export default class TodoItem extends Component<Props, State> {
  state: State = {
    editing: false,
  };

  handleDoubleClick = () => {
    this.setState({ editing: true });
  };

  handleSave(id: number, text: string) {
    if (text.length === 0) {
      this.props.deleteTodo(id);
    } else {
      this.props.editTodo(id, text);
    }
    this.setState({ editing: false });
  }

  render() {
    const { todo, markTodo, deleteTodo } = this.props;

    let element;
    if (this.state.editing) {
      element = (
        <TodoTextInput
          text={todo.text}
          editing={this.state.editing}
          onSave={(text) => this.handleSave(todo.id, text)}
        />
      );
    } else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.marked}
            onChange={() => markTodo(todo.id)}
          />
          <label onDoubleClick={this.handleDoubleClick}>{todo.text}</label>
          <button className="destroy" onClick={() => deleteTodo(todo.id)} />
        </div>
      );
    }

    return (
      <li
        className={classnames({
          completed: todo.marked,
          editing: this.state.editing,
        })}
      >
        {element}
      </li>
    );
  }
}
