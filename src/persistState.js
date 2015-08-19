export default function persistState(sessionId, parsers) {
  if (!sessionId) {
    return next => (...args) => next(...args);
  }

  function callParser(parserMethod, parserName, stateSlice) {
    const parser = parsers[parserName];
    if (parser && typeof parser[parserMethod] === 'function') {
      return parser[parserMethod](stateSlice);
    }
    return stateSlice;
  }

  // function serializeState(state) {
  //   if (!state) {
  //     return state;
  //   }
  //   return Object.keys(state).reduce((serialized, sliceName) => {
  //     serialized[sliceName] = callParser('serialize', sliceName, state[sliceName]);
  //     return serialized;
  //   }, {});
  // }

  function deserializeState(state) {
    if (!state) {
      return state;
    }
    return Object.keys(state).reduce((deserialized, sliceName) => {
      deserialized[sliceName] = callParser('deserialize', sliceName, state[sliceName]);
      return deserialized;
    }, {});
  }

  function parseState(fullState) {
    if (!fullState || !parsers) {
      return fullState;
    }
    return {
      ...fullState,
      committedState: deserializeState(fullState.committedState),
      computedStates: fullState.computedStates.map((computedState) => {
        return {
          ...computedState,
          state: deserializeState(computedState.state)
        };
      })
    };
  }

  return next => (reducer, initialState) => {
    const key = `redux-dev-session-${sessionId}`;

    let finalInitialState;
    try {
      finalInitialState = parseState(JSON.parse(localStorage.getItem(key))) || initialState;
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
