import React, { Component, PropTypes } from 'react';

class Counter extends Component {
  render() {
    const {
      startMonitoring,
      stopMonitoring,
      sendToMonitor,
      increment,
      decrement,
      counter,
    } = this.props;
    return (
      <p>
        Clicked: {counter} times <button onClick={increment}>+</button>{' '}
        <button onClick={decrement}>-</button>{' '}
        <button onClick={startMonitoring}>Start monitoring</button>{' '}
        <button onClick={stopMonitoring}>Stop monitoring</button>{' '}
        <button onClick={sendToMonitor}>Send to the monitor</button>
      </p>
    );
  }
}

Counter.propTypes = {
  startMonitoring: PropTypes.func.isRequired,
  stopMonitoring: PropTypes.func.isRequired,
  sendToMonitor: PropTypes.func.isRequired,
  increment: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired,
};

export default Counter;
