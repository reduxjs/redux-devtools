import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from './devTools';

export default function connectMonitor(monitorActionCreators = {}) {
  return Monitor => {
    function mapStateToProps(state) {
      return state;
    }
    function mapDispatchToProps(dispatch) {
      return {
        ...bindActionCreators(ActionCreators, dispatch),
        monitorActions: bindActionCreators(monitorActionCreators, dispatch)
      };
    }
    const ConnectedMonitor = connect(mapStateToProps, mapDispatchToProps)(Monitor);

    class DevTools extends Component {
      static Monitor = Monitor;

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
  };
}
