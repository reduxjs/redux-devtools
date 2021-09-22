import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import DevTools from './DevTools';
import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}

export default class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <TodoApp />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
