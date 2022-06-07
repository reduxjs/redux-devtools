import 'todomvc-app-css/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import configureStore from './store/configureStore';
import Root from './containers/Root';

const store = configureStore();

const root = createRoot(document.getElementById('root')!);
root.render(<Root store={store} />);
