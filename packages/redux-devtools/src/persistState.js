import mapValues from 'lodash/mapValues';
import identity from 'lodash/identity';

export default function persistState(sessionId, deserializeState = identity, deserializeAction = identity) {
  if (!sessionId) {
    return next => (...args) => next(...args);
  }

  function deserialize(state) {
    return {
      ...state,
      actionsById: mapValues(state.actionsById, liftedAction => ({
        ...liftedAction,
        action: deserializeAction(liftedAction.action)
      })),
      committedState: deserializeState(state.committedState),
      computedStates: state.computedStates.map(computedState => ({
        ...computedState,
        state: deserializeState(computedState.state)
      }))
    };
  }

  return next => (reducer, initialState, enhancer) => {
    const key = `redux-dev-session-${sessionId}`;

    let finalInitialState;
    try {
      const json = localStorage.getItem(key);
      if (json) {
        finalInitialState = deserialize(JSON.parse(json)) || initialState;
        next(reducer, initialState);
      }
    } catch (e) {
      console.warn('Could not read debug session from localStorage:', e);
      try {
        localStorage.removeItem(key);
      } finally {
        finalInitialState = undefined;
      }
    }

    const store = next(reducer, finalInitialState, enhancer);

    return {
      ...store,
      dispatch(action) {
        store.dispatch(action);

        try {
          localStorage.setItem(key, JSON.stringify(store.getState()));
        } catch (e) {
          console.warn('Could not write debug session to localStorage:', e);
        }

        return action;
      }
    };
  };
}
