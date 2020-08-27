import React, { Component } from 'react';
import PropTypes from 'prop-types';

interface Props {
  increment: () => void;
  incrementIfOdd: () => void;
  decrement: () => void;
  counter: number;
}

export default class Counter extends Component<Props> {
  static propTypes = {
    increment: PropTypes.func.isRequired,
    incrementIfOdd: PropTypes.func.isRequired,
    decrement: PropTypes.func.isRequired,
    counter: PropTypes.number.isRequired,
  };

  render() {
    const { increment, incrementIfOdd, decrement, counter } = this.props;
    return (
      <p>
        Clicked: {counter} times <button onClick={increment}>+</button>{' '}
        <button onClick={decrement}>-</button>{' '}
        <button onClick={incrementIfOdd}>Increment if odd</button>
      </p>
    );
  }
}
