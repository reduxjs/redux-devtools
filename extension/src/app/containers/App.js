import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Container, Notification } from 'devui';
import { liftedDispatch, getReport } from '@redux-devtools/app/lib/actions';
import { getActiveInstance } from '@redux-devtools/app/lib/reducers/instances';
import Settings from '@redux-devtools/app/lib/components/Settings';
import Actions from '@redux-devtools/app/lib/containers/Actions';
import Header from '@redux-devtools/app/lib/components/Header';

class App extends Component {
  openWindow = (position) => {
    chrome.runtime.sendMessage({ type: 'OPEN', position });
  };
  openOptionsPage = () => {
    if (navigator.userAgent.indexOf('Firefox') !== -1) {
      chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS' });
    } else {
      chrome.runtime.openOptionsPage();
    }
  };

  render() {
    const { position, options, section, theme, notification } = this.props;
    if (!position && (!options || !options.features)) {
      return (
        <div style={{ padding: '20px', width: '100%', textAlign: 'center' }}>
          No store found. Make sure to follow{' '}
          <a
            href="https://github.com/zalmoxisus/redux-devtools-extension#usage"
            target="_blank"
          >
            the instructions
          </a>
          .
        </div>
      );
    }

    let body;
    switch (section) {
      case 'Settings':
        body = <Settings />;
        break;
      default:
        body = <Actions />;
    }

    return (
      <Container themeData={theme}>
        <Header section={section} />
        {body}
        {notification && (
          <Notification
            type={notification.type}
            onClose={this.props.clearNotification}
          >
            {notification.message}
          </Notification>
        )}
      </Container>
    );
  }
}

App.propTypes = {
  bgStore: PropTypes.object,
  liftedDispatch: PropTypes.func.isRequired,
  getReport: PropTypes.func.isRequired,
  togglePersist: PropTypes.func.isRequired,
  selected: PropTypes.string,
  liftedState: PropTypes.object.isRequired,
  monitorState: PropTypes.object,
  options: PropTypes.object.isRequired,
  monitor: PropTypes.string,
  position: PropTypes.string,
  reports: PropTypes.array.isRequired,
  dispatcherIsOpen: PropTypes.bool,
  sliderIsOpen: PropTypes.bool,
};

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    selected: instances.selected,
    liftedState: instances.states[id],
    monitorState: state.monitor.monitorState,
    options: instances.options[id],
    monitor: state.monitor.selected,
    dispatcherIsOpen: state.monitor.dispatcherIsOpen,
    sliderIsOpen: state.monitor.sliderIsOpen,
    reports: state.reports.data,
    shouldSync: state.instances.sync,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    liftedDispatch: bindActionCreators(liftedDispatch, dispatch),
    getReport: bindActionCreators(getReport, dispatch),
    togglePersist: () => {
      dispatch({ type: 'TOGGLE_PERSIST' });
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
