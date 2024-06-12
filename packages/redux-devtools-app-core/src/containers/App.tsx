import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Notification } from '@redux-devtools/ui';
import { clearNotification } from '../actions';
import Header from '../components/Header';
import Actions from './Actions';
import Settings from '../components/Settings';
import { CoreStoreState } from '../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type OwnProps = {
  extraSettingsTabs?: { name: string; component: React.ComponentType }[];
};
type Props = StateProps & DispatchProps & OwnProps;

class App extends Component<Props> {
  render() {
    const { extraSettingsTabs, section, theme, notification } = this.props;
    let body;
    switch (section) {
      case 'Settings':
        body = <Settings extraTabs={extraSettingsTabs} />;
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

const mapStateToProps = (state: CoreStoreState) => ({
  section: state.section,
  theme: state.theme,
  notification: state.notification,
});

const actionCreators = {
  clearNotification,
};

export default connect(mapStateToProps, actionCreators)(App);
