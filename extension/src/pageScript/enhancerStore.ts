import { Action, compose, Reducer, StoreEnhancerStoreCreator } from 'redux';
import { instrument } from '@redux-devtools/instrument';
import { persistState } from '@redux-devtools/core';
import type { ConfigWithExpandedMaxAge } from './index';

export function getUrlParam(key: string) {
  const matches = new RegExp(`[?&]${key}=([^&#]+)\\b`).exec(
    window.location.href,
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
  A extends Action<string>,
  MonitorState,
  MonitorAction extends Action<string>,
>(
  next: StoreEnhancerStoreCreator,
  monitorReducer: Reducer<MonitorState, MonitorAction>,
  config: ConfigWithExpandedMaxAge,
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
    persistState(getUrlParam('debug_session')),
  )(next);
}
