import { compose } from 'redux';
import type { Action, Dispatch, Reducer, StoreEnhancer } from 'redux';
import type { Config, EnhancerOptions, InferComposedStoreExt } from './index';

function enhancer(options?: EnhancerOptions): StoreEnhancer {
  const config: Config = options || {};
  config.features = { pause: true, export: true, test: true };
  config.type = 'redux';
  if (config.autoPause === undefined) config.autoPause = true;
  if (config.latency === undefined) config.latency = 500;

  return function (createStore) {
    return function <S, A extends Action<string>, PreloadedState>(
      reducer: Reducer<S, A, PreloadedState>,
      preloadedState?: PreloadedState | undefined,
    ) {
      const store = createStore(reducer, preloadedState);
      const origDispatch = store.dispatch;

      const devTools = window.__REDUX_DEVTOOLS_EXTENSION__!.connect(config);
      devTools.init(store.getState());

      const dispatch: Dispatch<A> = function (action) {
        const r = origDispatch(action);
        devTools.send(action, store.getState());
        return r;
      };

      return Object.assign(store, { dispatch: dispatch });
    };
  };
}

function composeWithEnhancer(config?: EnhancerOptions) {
  return function (...funcs: StoreEnhancer[]) {
    return compose(compose(...funcs), enhancer(config));
  };
}

export function composeWithDevTools(
  config: Config,
): <StoreEnhancers extends readonly StoreEnhancer[]>(
  ...funcs: StoreEnhancers
) => StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
export function composeWithDevTools<
  StoreEnhancers extends readonly StoreEnhancer[],
>(
  ...funcs: StoreEnhancers
): StoreEnhancer<InferComposedStoreExt<StoreEnhancers>>;
export function composeWithDevTools(...funcs: [Config] | StoreEnhancer[]) {
  if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    if (funcs.length === 0) return enhancer();
    if (typeof funcs[0] === 'object') return composeWithEnhancer(funcs[0]);
    return composeWithEnhancer()(...(funcs as StoreEnhancer[]));
  }

  if (funcs.length === 0) return undefined;
  if (typeof funcs[0] === 'object') return compose;
  return compose(...(funcs as StoreEnhancer[]));
}

export const devToolsEnhancer: (options?: EnhancerOptions) => StoreEnhancer =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? enhancer
    : function () {
        return function (noop) {
          return noop;
        };
      };
