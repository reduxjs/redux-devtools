import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import type { Store } from 'redux';
import type { TodoState } from '../reducers';
import type { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}

export default class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <TodoApp />
      </Provider>
    );
  }
}
