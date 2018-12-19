import { is } from 'ramda';

export default function functor(v) {
  return is(Function, v) ? v : () => v;
}
