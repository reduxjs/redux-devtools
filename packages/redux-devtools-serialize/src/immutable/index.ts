import jsan from 'jsan';
import Immutable from 'immutable';
import serialize from './serialize';
import options from '../constants/options';

export default function (
  immutable: typeof Immutable,
  refs?: (new (data: any) => unknown)[] | null,
  customReplacer?: (
    key: string,
    value: unknown,
    defaultReplacer: (key: string, value: unknown) => unknown,
  ) => unknown,
  customReviver?: (
    key: string,
    value: unknown,
    defaultReviver: (key: string, value: unknown) => unknown,
  ) => unknown,
) {
  return {
    stringify: function (this: void, data: unknown) {
      return jsan.stringify(
        data,
        serialize(immutable, refs, customReplacer, customReviver).replacer,
        undefined,
        options,
      );
    },
    parse: function (this: void, data: string) {
      return jsan.parse(
        data,
        serialize(immutable, refs, customReplacer, customReviver).reviver,
      );
    },
    serialize: serialize,
  };
}
export { default as serialize } from './serialize';
