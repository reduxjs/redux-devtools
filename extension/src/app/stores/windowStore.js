import { createStore, compose, applyMiddleware } from 'redux';
import exportState from '@redux-devtools/app/lib/middlewares/exportState';
import api from '@redux-devtools/app/lib/middlewares/api';
import { CONNECT_REQUEST } from '@redux-devtools/app/lib/constants/socketActionTypes';
import syncStores from '../middlewares/windowSync';
import instanceSelector from '../middlewares/instanceSelector';
import rootReducer from '../reducers/window';

export default function configureStore(baseStore, position, preloadedState) {
  let enhancer;
  const middlewares = [exportState, api, syncStores(baseStore)];
  if (!position || position === '#popup') {
    // select current tab instance for devPanel and pageAction
    middlewares.push(instanceSelector);
  }
  if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(...middlewares);
  } else {
    enhancer = compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (noop) => noop
    );
  }
  const store = createStore(rootReducer, preloadedState, enhancer);

  chrome.storage.local.get(['s:hostname', 's:port', 's:secure'], (options) => {
    if (!options['s:hostname'] || !options['s:port']) return;
    store.dispatch({
      type: CONNECT_REQUEST,
      options: {
        hostname: options['s:hostname'],
        port: options['s:port'],
        secure: options['s:secure'],
      },
    });
  });

  return store;
}
