import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect } from 'react-router';
import { ReduxRouter } from 'redux-router';
import Wrapper from './Wrapper';
import App from './App';

class Root extends Component {
  render() {
    return (
      <ReduxRouter>
        <Redirect from="/" to="Standard Todo"/>
        <Route path="/" component={Wrapper}>
          <Route path="/:id" component={App}/>
        </Route>
      </ReduxRouter>
    );
  }
}

export default Root;
