import 'todomvc-app-css/index.css';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/Root', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const RootContainer = require('./containers/Root').default;
    render(
      <AppContainer>
        <RootContainer store={store} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
