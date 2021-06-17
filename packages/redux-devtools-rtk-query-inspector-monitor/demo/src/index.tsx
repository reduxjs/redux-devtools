import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import './index.css';
import { store } from './store';
import DevTools from './DevTools';

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <App />
    <DevTools />
  </Provider>,
  rootElement
);
