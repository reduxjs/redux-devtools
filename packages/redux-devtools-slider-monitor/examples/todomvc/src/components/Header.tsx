import React, { Component } from 'react';
import TodoTextInput from './TodoTextInput';

interface Props {
  addTodo: (text: string) => void;
}

export default class Header extends Component<Props> {
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
