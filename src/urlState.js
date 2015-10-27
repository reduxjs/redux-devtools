function serializeState(state) {
  return encodeURIComponent(JSON.stringify(state));
}

function deserializeState(json) {
  try {
    return JSON.parse(decodeURIComponent(json));
  } catch (e) {
    console.log(json);
    console.error('Could not parse state from Url', e);
    console.log('To continue, remove query param that\'s trying to set state!');
    throw e;
  }
}


export default function urlEncodedStateReducer(stateUriComponent) {
  return next => (reducer, initialState) => {
    let store;
    if (stateUriComponent) {
      const stateOnUrl = deserializeState(stateUriComponent);
      store = next(reducer, stateOnUrl);
    } else {
      store = next(reducer, initialState);
    }

    return store;
  };
}
