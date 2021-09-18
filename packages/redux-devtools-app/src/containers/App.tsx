import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Container, Notification } from '@redux-devtools/ui';
import { clearNotification } from '../actions';
import Header from '../components/Header';
import Actions from '../containers/Actions';
import Settings from '../components/Settings';
import { StoreState } from '../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class App extends Component<Props> {
  render() {
    const { section, theme, notification } = this.props;
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

const mapStateToProps = (state: StoreState) => ({
  section: state.section,
  theme: state.theme,
  notification: state.notification,
});

const actionCreators = {
  clearNotification,
};

export default connect(mapStateToProps, actionCreators)(App);
