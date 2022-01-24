import { Action, compose, Reducer, StoreEnhancerStoreCreator } from 'redux';
import { instrument } from '@redux-devtools/instrument';
import { persistState } from '@redux-devtools/core';
import { ConfigWithExpandedMaxAge } from '../../browser/extension/inject/pageScript';

export function getUrlParam(key: string) {
  const matches = window.location.href.match(
    new RegExp(`[?&]${key}=([^&#]+)\\b`)
  );
  return matches && matches.length > 0 ? matches[1] : null;
}

declare global {
  interface Window {
    shouldCatchErrors?: boolean;
  }
}

export default function configureStore<
  S,
  A extends Action<unknown>,
  MonitorState,
  MonitorAction extends Action<unknown>
>(
  next: StoreEnhancerStoreCreator,
  monitorReducer: Reducer<MonitorState, MonitorAction>,
  config: ConfigWithExpandedMaxAge
) {
  return compose(
    instrument(monitorReducer, {
      maxAge: config.maxAge,
      trace: config.trace,
      traceLimit: config.traceLimit,
      shouldCatchErrors: config.shouldCatchErrors || window.shouldCatchErrors,
      shouldHotReload: config.shouldHotReload,
      shouldRecordChanges: config.shouldRecordChanges,
      shouldStartLocked: config.shouldStartLocked,
      pauseActionType: config.pauseActionType || '@@PAUSED',
    }),
    persistState(getUrlParam('debug_session'))
  )(next);
}
