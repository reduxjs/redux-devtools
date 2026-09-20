import React, { Component } from 'react';

interface Props {
  increment: () => void;
  incrementIfOdd: () => void;
  decrement: () => void;
  counter: number;
}

export default class Counter extends Component<Props> {
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
