import 'todomvc-app-css/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const rootEl = document.getElementById('root');
const root = ReactDOM.createRoot(rootEl!);
root.render(<Root store={store} />);
