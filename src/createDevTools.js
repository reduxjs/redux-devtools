import React, { cloneElement, Component, PropTypes } from 'react';
import enhance from './enhance';

export default function createDevTools(Monitor) {
  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static enhance = enhance(Monitor.reducer);

    render() {
      return <Monitor store={this.context.store.devToolsStore} />;
    }
  }
}

