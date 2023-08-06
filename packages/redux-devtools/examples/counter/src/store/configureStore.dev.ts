import {
  createStore,
  applyMiddleware,
  compose,
  PreloadedState,
  Reducer,
} from 'redux';
import { persistState } from '@redux-devtools/core';
import thunk from 'redux-thunk';
import rootReducer, { CounterState } from '../reducers';
import DevTools from '../containers/DevTools';

function getDebugSessionKey() {
  const matches = /[?&]debug_session=([^&#]+)\b/.exec(window.location.href);
  return matches && matches.length > 0 ? matches[1] : null;
}

const enhancer = compose(
  applyMiddleware(thunk),
  DevTools.instrument(),
  persistState(getDebugSessionKey()),
);

export default function configureStore(
  initialState?: PreloadedState<CounterState>,
) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      store.replaceReducer(require('../reducers').default as Reducer),
    );
  }

  return store;
}
