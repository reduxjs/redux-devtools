import { Action, compose, Reducer, StoreEnhancerStoreCreator } from 'redux';
import instrument, {
  LiftedAction,
  LiftedState,
} from '@redux-devtools/instrument';
import persistState from '@redux-devtools/core/lib/persistState';
import {
  Config,
  ConfigWithExpandedMaxAge,
} from '../../browser/extension/inject/pageScript';

export function getUrlParam(key: string) {
  const matches = window.location.href.match(
    new RegExp(`[?&]${key}=([^&#]+)\\b`)
  );
  return matches && matches.length > 0 ? matches[1] : null;
}

export default function configureStore(
  next: StoreEnhancerStoreCreator,
  monitorReducer: Reducer,
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
    persistState(
      getUrlParam('debug_session'),
      config.deserializeState,
      config.deserializeAction
    )
  )(next);
}
