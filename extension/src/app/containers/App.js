import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Notification } from 'devui';
import { getActiveInstance } from '@redux-devtools/app/lib/reducers/instances';
import Settings from '@redux-devtools/app/lib/components/Settings';
import Actions from '@redux-devtools/app/lib/containers/Actions';
import Header from '@redux-devtools/app/lib/components/Header';
import { clearNotification } from '@redux-devtools/app/lib/actions';

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

function mapStateToProps(state) {
  const instances = state.instances;
  const id = getActiveInstance(instances);
  return {
    options: instances.options[id],
    section: state.section,
    theme: state.theme,
    notification: state.notification,
  };
}

const actionCreators = {
  clearNotification,
};

export default connect(mapStateToProps, actionCreators)(App);
