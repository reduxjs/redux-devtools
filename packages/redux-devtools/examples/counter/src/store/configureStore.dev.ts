import type { Reducer, StoreEnhancer, Middleware } from 'redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { persistState } from '@redux-devtools/core';
import { thunk } from 'redux-thunk';
import type { CounterState } from '../reducers';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';
import type { CounterAction } from '../actions/CounterActions';

function getDebugSessionKey() {
  const matches = /[?&]debug_session=([^&#]+)\b/.exec(window.location.href);
  return matches && matches.length > 0 ? matches[1] : null;
}

const enhancer: StoreEnhancer = compose(
  applyMiddleware(thunk as unknown as Middleware),
  DevTools.instrument(),
  persistState(getDebugSessionKey()),
);

export default function configureStore(initialState?: Partial<CounterState>) {
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(
        require('../reducers').default as Reducer<
          CounterState,
          CounterAction,
          Partial<CounterState>
        >,
      ),
    );
  }

  return store;
}
