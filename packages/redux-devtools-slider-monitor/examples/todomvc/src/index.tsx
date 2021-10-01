import 'todomvc-app-css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const rootEl = document.getElementById('root');
ReactDOM.render(<Root store={store} />, rootEl);
