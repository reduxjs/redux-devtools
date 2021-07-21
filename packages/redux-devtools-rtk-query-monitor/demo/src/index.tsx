import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import { store } from './store';
import DevTools from './features/DevTools/DevTools';
import { BrowserRouter } from 'react-router-dom';
import { App } from 'App';
import { worker } from './mocks/browser';

function renderApp() {
  const rootElement = document.getElementById('root');

  ReactDOM.render(
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
          <DevTools />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>,
    rootElement
  );
}

worker.start({ quiet: true }).then(renderApp, renderApp);
