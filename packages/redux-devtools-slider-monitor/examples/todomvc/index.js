import 'todomvc-app-css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const rootEl = document.getElementById('root');
const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Root store={store} />
    </AppContainer>,
    rootEl
  );
};

render(Root);
if (module.hot) {
  module.hot.accept('./containers/Root', render);
}
