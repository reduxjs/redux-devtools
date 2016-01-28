import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const enhancer = applyMiddleware(thunk);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}
