import { Iterable, fromJS } from 'immutable';
import isIterable from './isIterable';

function iterateToKey(obj, key) { // maybe there's a better way, dunno
  let idx = 0;
  for (let entry of obj) {
    if (Array.isArray(entry)) {
      if (entry[0] === key) return entry[1];
    } else {
      if (idx > key) return;
      if (idx === key) return entry;
    }
    idx++;
  }
}

export default function getInspectedState(state, path, convertImmutable) {
  state = path && path.length ?
    {
      [path[path.length - 1]]: path.reduce(
        (s, key) => {
          if (!s) {
            return s;
          }

          if (Iterable.isAssociative(s)) {
            return s.get(key);
          } else if (isIterable(s)) {
            return iterateToKey(s, key);
          }

          return s[key];
        },
        state
      )
    } : state;

  if (convertImmutable) {
    try {
      state = fromJS(state).toJS();
    } catch(e) {}
  }

  return state;
}
