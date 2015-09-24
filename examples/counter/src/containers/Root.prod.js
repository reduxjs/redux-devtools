import React, { Component } from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import CounterApp from './CounterApp';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <CounterApp />
      </Provider>
    );
  }
}
