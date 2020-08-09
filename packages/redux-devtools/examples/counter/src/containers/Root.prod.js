import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CounterApp from './CounterApp';

class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <CounterApp />
      </Provider>
    );
  }
}

export default hot(Root);
