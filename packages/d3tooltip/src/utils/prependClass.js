import { mapObjIndexed, join } from 'ramda';
import functor from './functor';

export default function prependClass(className) {
  return mapObjIndexed((value, key) => {
    if (key === 'class') {
      const fn = functor(value);

      return (d, i) => {
        const classNames = fn(d, i);
        if (classNames !== className) {
          return join(' ', [className, classNames]);
        }
        return classNames;
      };
    }

    return value;
  });
}
