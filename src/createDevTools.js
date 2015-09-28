import React, { Component, PropTypes } from 'react';
import enhance from './enhance';
import connectMonitor from './connectMonitor';

export default function createDevTools(monitor) {
  const Monitor = connectMonitor(monitor);

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static enhance = enhance(Monitor.reducer);

    render() {
      return (
        <Monitor {...this.props}
                 store={this.context.store.devToolsStore} />
      );
    }
  };
}

