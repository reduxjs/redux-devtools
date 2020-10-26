import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers/background';
import api from '../middlewares/api';

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, applyMiddleware(api));
/*
  let enhancer;
  if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(api);
  } else {
    const logger = require('redux-logger');
    enhancer = applyMiddleware(api, logger());
  }

  return createStore(rootReducer, preloadedState, enhancer);
*/
}
