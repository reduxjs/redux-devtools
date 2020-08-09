import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';

class Root extends Component {
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
