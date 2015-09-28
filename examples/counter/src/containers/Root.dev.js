import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { DevToolsProvider } from 'redux-devtools';
import CounterApp from './CounterApp';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from '../dock/DockMonitor';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    return (
      <div>
        <Provider store={store}>
          <CounterApp />
        </Provider>
        <DevToolsProvider store={store}>
          <DockMonitor>
            <LogMonitor />
          </DockMonitor>
        </DevToolsProvider>
      </div>
    );
  }
}
