import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();
const rootElement = document.getElementById('root');

const devRender = () => {
  const RootContainer = require('./containers/Root').default;
  render(
    <AppContainer>
      <RootContainer
        store={ store }
        />
    </AppContainer>,
    rootElement
  );
};

if (module.hot) {
  devRender();
  module.hot.accept('./containers/Root', devRender);
} else {
  render(
    <Root
      store={ store }
      />,
    rootElement
  );
}
