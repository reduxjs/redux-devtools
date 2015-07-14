export default function persistState(sessionId) {
  if (!sessionId) {
    return next => (...args) => next(...args);
  }

  return next => (reducer, initialState) => {
    const key = `redux-dev-session-${sessionId}`;

    let finalInitialState;
    try {
      finalInitialState = JSON.parse(localStorage.getItem(key)) || initialState;
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
