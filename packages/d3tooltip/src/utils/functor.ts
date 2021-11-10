import { is } from 'ramda';
import { Primitive } from 'd3';

export default function functor<Datum>(
  v: string | ((datum: Datum, index?: number, outerIndex?: number) => string)
): (datum: Datum, index?: number, outerIndex?: number) => string;
export default function functor<Datum>(
  v:
    | Primitive
    | ((datum: Datum, index: number, outerIndex?: number) => Primitive)
): (datum: Datum, index?: number, outerIndex?: number) => Primitive;
export default function functor<Datum>(
  v:
    | Primitive
    | ((datum: Datum, index: number, outerIndex?: number) => Primitive)
): (datum: Datum, index: number, outerIndex?: number) => Primitive {
  return is(Function, v)
    ? (v as (datum: Datum, index: number, outerIndex?: number) => Primitive)
    : () => v;
}
