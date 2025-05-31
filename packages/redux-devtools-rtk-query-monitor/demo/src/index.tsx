import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Provider as ChakraProvider } from './components/ui/provider';
import './index.css';
import { store } from './store';
import DevTools from './features/DevTools/DevTools';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { worker } from './mocks/browser';

function renderApp() {
  const rootElement = document.getElementById('root');
  const root = ReactDOM.createRoot(rootElement!);
  root.render(
    <Provider store={store}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
          <DevTools />
        </BrowserRouter>
      </ChakraProvider>
    </Provider>,
  );
}

worker.start({ quiet: true }).then(renderApp, renderApp);
