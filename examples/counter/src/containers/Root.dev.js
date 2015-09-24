import React, { Component } from 'react';
import { Provider } from 'react-redux';
import CounterApp from './CounterApp';
import Dock from 'react-dock';
import LogMonitor from 'redux-devtools-log-monitor';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <div>
        <Provider store={store}>
          <CounterApp />
        </Provider>
        <Dock position='right' isVisible dimMode='none'>
          <LogMonitor store={store.devToolsStore} />
        </Dock>
      </div>
    );
  }
}
