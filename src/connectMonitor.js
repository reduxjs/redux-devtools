import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ActionCreators } from './devTools';

export default function connectMonitor(Monitor) {
  const ConnectedMonitor = connect(state => state, ActionCreators)(Monitor);

  class DevTools extends Component {
    static propTypes = {
      store(props, propName, componentName) {
        if (!props.store) {
          return new Error('Required prop `store` was not specified in `' + componentName + '`.');
        }
        if (!props.store.devToolsStore) {
          return new Error(
            'Could not find the DevTools store inside the `store` prop passed to `' +
            componentName +
            '`. Have you applied the devTools() store enhancer?'
          );
        }
      }
    };

    render() {
      const { store } = this.props;
      if (!store) {
        return null;
      }

      const { devToolsStore } = store;
      if (!devToolsStore) {
        return null;
      }

      return <ConnectedMonitor {...this.props} store={devToolsStore} />;
    }
  }

  return DevTools;
}
