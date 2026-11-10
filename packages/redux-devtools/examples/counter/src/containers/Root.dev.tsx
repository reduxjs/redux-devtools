import React, { Component } from 'react';
import { Provider } from 'react-redux';
import type { Store } from 'redux';
import CounterApp from './CounterApp';
import DevTools from './DevTools';
import type { CounterState } from '../reducers';
import type { CounterAction } from '../actions/CounterActions';

interface Props {
  store: Store<CounterState, CounterAction>;
}

export default class Root extends Component<Props> {
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
