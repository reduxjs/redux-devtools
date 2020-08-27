import React, { Component } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/CounterActions';
import { CounterAction } from '../actions/CounterActions';
import { CounterState } from '../reducers';

interface Props {
  counter: number;
  dispatch: Dispatch<CounterAction>;
}

class CounterApp extends Component<Props> {
  render() {
    const { counter, dispatch } = this.props;
    return (
      <Counter
        counter={counter}
        {...bindActionCreators(CounterActions, dispatch)}
      />
    );
  }
}

function select(state: CounterState) {
  return {
    counter: state.counter,
  };
}

export default connect(select)(CounterApp);
