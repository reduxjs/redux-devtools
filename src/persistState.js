export default function persistState(sessionId, stateDeserializer = null, actionDeserializer = null) {
  if (!sessionId) {
    return next => (...args) => next(...args);
  }

  function deserializeState(fullState) {
    if (!fullState || typeof stateDeserializer !== 'function') {
      return fullState;
    }
    return {
      ...fullState,
      committedState: stateDeserializer(fullState.committedState),
      computedStates: fullState.computedStates.map((computedState) => {
        return {
          ...computedState,
          state: stateDeserializer(computedState.state)
        };
      })
    };
  }

  function deserializeActions(fullState) {
    if (!fullState || typeof actionDeserializer !== 'function') {
      return fullState;
    }
    return {
      ...fullState,
      stagedActions: fullState.stagedActions.map((action) => {
        return actionDeserializer(action);
      })
    };
  }

  return next => (reducer, initialState) => {
    const key = `redux-dev-session-${sessionId}`;

    let finalInitialState;
    try {
      finalInitialState = deserializeActions(deserializeState(JSON.parse(localStorage.getItem(key)))) || initialState;
      next(reducer, initialState);
    } catch (e) {
      console.warn('Could not read debug session from localStorage:', e);
      try {
        localStorage.removeItem(key);
      } finally {
        finalInitialState = undefined;
      }
    }

    const store = next(reducer, finalInitialState);

    return {
      ...store,
      dispatch(action) {
        store.dispatch(action);

        try {
          localStorage.setItem(key, JSON.stringify(store.getState()));
        } catch (e) {
          console.warn('Could not write debug session from localStorage:', e);
        }

        return action;
      }
    };
  };
}
