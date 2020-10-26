import React, { Component } from 'react';

const withDevTools = (
  // process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
);

class Counter extends Component {
  constructor() {
    super();
    this.state = { counter: 0 };
    
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  componentWillMount() {
    if (withDevTools) {
      this.devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect();
      this.unsubscribe = this.devTools.subscribe((message) => {
        // Implement monitors actions.
        // For example time traveling:
        if (message.type === 'DISPATCH' && message.payload.type === 'JUMP_TO_STATE') {
          this.setState(message.state);
        }
      });
    }
  }

  componentWillUnmount() {
    if (withDevTools) {
      this.unsubscribe(); // Use if you have other subscribers from other components.
      window.__REDUX_DEVTOOLS_EXTENSION__.disconnect(); // If there aren't other subscribers.
    }
  }

  increment() {
    const state = { counter: this.state.counter + 1 };
    if (withDevTools) this.devTools.send('increment', state);
    this.setState(state);
  }

  decrement() {
    const state = { counter: this.state.counter - 1 };
    if (withDevTools) this.devTools.send('decrement', state);
    this.setState(state);
  }

  render() {
    const { counter } = this.state;
    return (
      <p>
        Clicked: {counter} times
        {' '}
        <button onClick={this.increment}>+</button>
        {' '}
        <button onClick={this.decrement}>-</button>
      </p>
    );
  }
}

export default Counter;
