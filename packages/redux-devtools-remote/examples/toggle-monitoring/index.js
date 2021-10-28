import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';

const store = configureStore();

render(
  <div id="container">
    <Provider store={store}>
      <App />
    </Provider>
    <iframe src="http://remotedev.io/local/" />
  </div>,
  document.getElementById('root')
);
