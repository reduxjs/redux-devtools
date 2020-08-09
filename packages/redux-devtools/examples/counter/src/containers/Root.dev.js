import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CounterApp from './CounterApp';
import DevTools from './DevTools';

class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div>
          <CounterApp />
          <DevTools />
        </div>
      </Provider>
    );
  }
}

export default hot(Root);
