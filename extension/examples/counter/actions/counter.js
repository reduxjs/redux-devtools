export const INCREMENT_COUNTER = 'INCREMENT_COUNTER';
export const DECREMENT_COUNTER = 'DECREMENT_COUNTER';

let t;

export function increment() {
  return {
    type: INCREMENT_COUNTER
  };
}

export function decrement() {
  return {
    type: DECREMENT_COUNTER
  };
}

export function autoIncrement(delay = 10) {
  return dispatch => {
    if (t) {
      clearInterval(t);
      t = undefined;
      return;
    }
    t = setInterval(() => {
      dispatch(increment());
    }, delay);
  };
}

export function incrementAsync(delay = 1000) {
  return dispatch => {
    setTimeout(() => {
      dispatch(increment());
    }, delay);
  };
}
