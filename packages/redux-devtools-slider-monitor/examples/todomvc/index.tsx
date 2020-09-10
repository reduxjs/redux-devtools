import 'todomvc-app-css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const rootEl = document.getElementById('root');
ReactDOM.render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  rootEl
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RootContainer = require('./containers/Root').default;
    ReactDOM.render(
      <AppContainer>
        <RootContainer store={store} />
      </AppContainer>,
      rootEl
    );
  });
}
