import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TodoTextInput from './TodoTextInput';

interface Props {
  addTodo: (text: string) => void;
}

export default class Header extends Component<Props> {
  static propTypes = {
    addTodo: PropTypes.func.isRequired,
  };

  handleSave = (text: string) => {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  };

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          newTodo
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }
}
