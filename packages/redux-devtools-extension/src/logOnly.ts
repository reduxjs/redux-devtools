import assign from './utils/assign';
import { compose, StoreEnhancer } from 'redux';
import { EnhancerOptions } from './index';

function enhancer() {
  const config = arguments[0] || {};
  config.features = { pause: true, export: true, test: true };
  config.type = 'redux';
  if (config.autoPause === undefined) config.autoPause = true;
  if (config.latency === undefined) config.latency = 500;

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      const store = createStore(reducer, preloadedState, enhancer);
      const origDispatch = store.dispatch;

      const devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect(config);
      devTools.init(store.getState());

      const dispatch = function (action) {
        const r = origDispatch(action);
        devTools.send(action, store.getState());
        return r;
      };

      if (Object.assign) return Object.assign(store, { dispatch: dispatch });
      return assign(store, 'dispatch', dispatch);
    };
  };
}

function composeWithEnhancer(config) {
  return function () {
    return compose(compose.apply(null, arguments), enhancer(config));
  };
}

export const composeWithDevTools = function () {
  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    if (arguments.length === 0) return enhancer();
    if (typeof arguments[0] === 'object')
      return composeWithEnhancer(arguments[0]);
    return composeWithEnhancer().apply(null, arguments);
  }

  if (arguments.length === 0) return undefined;
  if (typeof arguments[0] === 'object') return compose;
  return compose.apply(null, arguments);
};

export const devToolsEnhancer: (options?: EnhancerOptions) => StoreEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? enhancer
    : function () {
        return function (noop) {
          return noop;
        };
      };
