import { fromJS, isAssociative, Map } from 'immutable';
import isIterable from './isIterable';

function iterateToKey(obj: any, key: string | number) {
  // maybe there's a better way, dunno
  let idx = 0;
  for (const entry of obj) {
    if (Array.isArray(entry)) {
      if (entry[0] === key) return entry[1];
    } else {
      if (idx > key) return;
      if (idx === key) return entry;
    }
    idx++;
  }
}

export default function getInspectedState<S>(
  state: S,
  path: (string | number)[],
  convertImmutable: boolean
): S {
  state =
    path && path.length
      ? ({
          [path[path.length - 1]]: path.reduce((s: any, key) => {
            if (!s) {
              return s;
            }

            if (isAssociative(s)) {
              return s.get(key as number);
            } else if (isIterable(s)) {
              return iterateToKey(s, key);
            }

            return s[key];
          }, state),
        } as S)
      : state;

  if (convertImmutable) {
    try {
      state = (fromJS(state) as Map<unknown, unknown>).toJS() as unknown as S;
    } catch (e) {} // eslint-disable-line no-empty
  }

  return state;
}
