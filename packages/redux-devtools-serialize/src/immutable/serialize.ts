import Immutable, { OrderedSet, Record } from 'immutable';
import { mark, extract, refer } from '../helpers';
import options from '../constants/options';
import { SerializedImmutableData } from '../types';

export default function serialize(
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
  function replacer(key: string, value: unknown) {
    if (value instanceof immutable.Record)
      return refer(value as Record<any>, 'ImmutableRecord', 'toObject', refs);
    if (value instanceof immutable.Range)
      return extract(value, 'ImmutableRange');
    if (value instanceof immutable.Repeat)
      return extract(value, 'ImmutableRepeat');
    if (immutable.OrderedMap.isOrderedMap(value))
      return mark(value, 'ImmutableOrderedMap', 'toObject');
    if (immutable.Map.isMap(value))
      return mark(value, 'ImmutableMap', 'toObject');
    if (immutable.List.isList(value))
      return mark(value, 'ImmutableList', 'toArray');
    if (immutable.OrderedSet.isOrderedSet(value))
      return mark(value, 'ImmutableOrderedSet', 'toArray');
    if (immutable.Set.isSet(value))
      return mark(value, 'ImmutableSet', 'toArray');
    if (immutable.Seq.isSeq(value))
      return mark(value, 'ImmutableSeq', 'toArray');
    if (immutable.Stack.isStack(value))
      return mark(value, 'ImmutableStack', 'toArray');
    return value;
  }

  function reviver(key: string, value: unknown) {
    if (
      typeof value === 'object' &&
      value !== null &&
      '__serializedType__' in value
    ) {
      const immutableValue = value as SerializedImmutableData;
      switch (immutableValue.__serializedType__) {
        case 'ImmutableMap':
          return immutable.Map(immutableValue.data);
        case 'ImmutableOrderedMap':
          return immutable.OrderedMap(immutableValue.data);
        case 'ImmutableList':
          return immutable.List(immutableValue.data);
        case 'ImmutableRange':
          return immutable.Range(
            immutableValue.data._start,
            immutableValue.data._end,
            immutableValue.data._step,
          );
        case 'ImmutableRepeat':
          return immutable.Repeat(
            immutableValue.data._value,
            immutableValue.data.size,
          );
        case 'ImmutableSet':
          return immutable.Set(immutableValue.data);
        case 'ImmutableOrderedSet':
          return immutable.OrderedSet(immutableValue.data);
        case 'ImmutableSeq':
          return immutable.Seq(immutableValue.data);
        case 'ImmutableStack':
          return immutable.Stack(immutableValue.data);
        case 'ImmutableRecord':
          return refs && refs[immutableValue.__serializedRef__!]
            ? new refs[immutableValue.__serializedRef__!](immutableValue.data)
            : immutable.Map(immutableValue.data);
        default:
          return (immutableValue as { data: unknown }).data;
      }
    }
    return value;
  }

  return {
    replacer: customReplacer
      ? function (key: string, value: unknown) {
          return customReplacer(key, value, replacer);
        }
      : replacer,
    reviver: customReviver
      ? function (key: string, value: unknown) {
          return customReviver(key, value, reviver);
        }
      : reviver,
    options: options,
  };
}
