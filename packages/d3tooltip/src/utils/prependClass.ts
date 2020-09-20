import { mapObjIndexed, join } from 'ramda';
import functor from './functor';
import { Primitive } from 'd3';

export default function prependClass<Datum>(className: string) {
  return mapObjIndexed(
    (
      value:
        | Primitive
        | ((datum: Datum, index: number, outerIndex?: number) => Primitive),
      key
    ) => {
      if (key === 'class') {
        const fn = functor(value);

        return (d: Datum, i: number) => {
          const classNames = fn(d, i);
          if (classNames !== className) {
            return join(' ', [className, classNames]);
          }
          return classNames;
        };
      }

      return value;
    }
  );
}
