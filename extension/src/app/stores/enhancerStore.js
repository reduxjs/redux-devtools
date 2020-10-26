import { compose } from 'redux';
import instrument from 'redux-devtools-instrument';
import persistState from 'redux-devtools/lib/persistState';

export function getUrlParam(key) {
  const matches = window.location.href.match(new RegExp(`[?&]${key}=([^&#]+)\\b`));
  return (matches && matches.length > 0) ? matches[1] : null;
}

export default function configureStore(next, monitorReducer, config) {
  return compose(
    instrument(
      monitorReducer,
      {
        maxAge: config.maxAge,
        trace: config.trace,
        traceLimit: config.traceLimit,
        shouldCatchErrors: config.shouldCatchErrors || window.shouldCatchErrors,
        shouldHotReload: config.shouldHotReload,
        shouldRecordChanges: config.shouldRecordChanges,
        shouldStartLocked: config.shouldStartLocked,
        pauseActionType: config.pauseActionType || '@@PAUSED'
      }
    ),
    persistState(
      getUrlParam('debug_session'),
      config.deserializeState,
      config.deserializeAction
    )
  )(next);
}
