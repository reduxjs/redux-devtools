import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}

class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <TodoApp />
      </Provider>
    );
  }
}

export default hot(Root);
