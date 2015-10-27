import React, { PropTypes, Component } from 'react';

export default class LogMonitor extends Component {
  static propTypes = {
    computedState: PropTypes.object.isRequired
  };

  render() {
    const stateUriComponent = encodeURIComponent(JSON.stringify(this.props.computedState));

    // TODO: don't blow away other params
    const urlForThisState = `?reduxDevState=${stateUriComponent}`;

    return <a href={urlForThisState}>Current State</a>;
  }
}
