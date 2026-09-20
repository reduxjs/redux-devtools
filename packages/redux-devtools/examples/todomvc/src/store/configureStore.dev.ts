import { createStore, compose, StoreEnhancer } from 'redux';
import { persistState } from '@redux-devtools/core';
import rootReducer, { TodoState } from '../reducers';
import DevTools from '../containers/DevTools';

function getDebugSessionKey() {
  const matches = /[?&]debug_session=([^&#]+)\b/.exec(window.location.href);
  return matches && matches.length > 0 ? matches[1] : null;
}

const enhancer: StoreEnhancer = compose(
  DevTools.instrument(),
  persistState(getDebugSessionKey()),
);

export default function configureStore(initialState?: Partial<TodoState>) {
  return createStore(rootReducer, initialState, enhancer);
}
