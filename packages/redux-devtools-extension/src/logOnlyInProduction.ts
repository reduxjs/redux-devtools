import { compose, StoreEnhancer } from 'redux';
import * as logOnly from './logOnly';
import { Config, EnhancerOptions } from './index';

declare const process: {
  env: {
    NODE_ENV: string;
  };
};

function extensionComposeStub(
  config: Config
): (...funcs: StoreEnhancer[]) => StoreEnhancer;
function extensionComposeStub(...funcs: StoreEnhancer[]): StoreEnhancer;
function extensionComposeStub(...funcs: [Config] | StoreEnhancer[]) {
  if (funcs.length === 0) return undefined;
  if (typeof funcs[0] === 'object') return compose;
  return compose(...(funcs as StoreEnhancer[]));
}

export const composeWithDevTools =
  process.env.NODE_ENV === 'production'
    ? logOnly.composeWithDevTools
    : typeof window !== 'undefined' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : extensionComposeStub;

export const devToolsEnhancer: (options?: EnhancerOptions) => StoreEnhancer =
  process.env.NODE_ENV === 'production'
    ? logOnly.devToolsEnhancer
    : typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__
    : function () {
        return function (noop) {
          return noop;
        };
      };
