import { createStore, applyMiddleware, compose } from 'redux';
import devTools, { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import DockMonitor from '../dock/DockMonitor';
import LogMonitor from 'redux-devtools-log-monitor';

const finalCreateStore = compose(
  applyMiddleware(
    thunk
  ),
  devTools(
    LogMonitor.createReducer({
      preserveScrollTop: true
    }),
    DockMonitor.wrapReducer({
      position: 'right',
      isVisible: true
    })
  ),
  persistState(
    window.location.href.match(
      /[?&]debug_session=([^&]+)\b/
    )
  )
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(rootReducer, initialState);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
