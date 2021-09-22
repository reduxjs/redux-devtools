import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import CounterApp from './CounterApp';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';

interface Props {
  store: Store<CounterState, CounterAction>;
}

export default class Root extends Component<Props> {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <CounterApp />
      </Provider>
    );
  }
}
