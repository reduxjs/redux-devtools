import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import CounterApp from './CounterApp';
import DevTools from './DevTools';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';

interface Props {
  store: Store<CounterState, CounterAction>;
}

class Root extends Component<Props> {
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
