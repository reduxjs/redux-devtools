var helpers = require('../helpers');
var mark = helpers.mark;
var extract = helpers.extract;
var refer = helpers.refer;
var options = require('../constants/options');

module.exports = function serialize(
  Immutable,
  refs,
  customReplacer,
  customReviver
) {
  function replacer(key, value) {
    if (value instanceof Immutable.Record)
      return refer(value, 'ImmutableRecord', 'toObject', refs);
    if (value instanceof Immutable.Range)
      return extract(value, 'ImmutableRange');
    if (value instanceof Immutable.Repeat)
      return extract(value, 'ImmutableRepeat');
    if (Immutable.OrderedMap.isOrderedMap(value))
      return mark(value, 'ImmutableOrderedMap', 'toObject');
    if (Immutable.Map.isMap(value))
      return mark(value, 'ImmutableMap', 'toObject');
    if (Immutable.List.isList(value))
      return mark(value, 'ImmutableList', 'toArray');
    if (Immutable.OrderedSet.isOrderedSet(value))
      return mark(value, 'ImmutableOrderedSet', 'toArray');
    if (Immutable.Set.isSet(value))
      return mark(value, 'ImmutableSet', 'toArray');
    if (Immutable.Seq.isSeq(value))
      return mark(value, 'ImmutableSeq', 'toArray');
    if (Immutable.Stack.isStack(value))
      return mark(value, 'ImmutableStack', 'toArray');
    return value;
  }

  function reviver(key, value) {
    if (
      typeof value === 'object' &&
      value !== null &&
      '__serializedType__' in value
    ) {
      var data = value.data;
      switch (value.__serializedType__) {
        case 'ImmutableMap':
          return Immutable.Map(data);
        case 'ImmutableOrderedMap':
          return Immutable.OrderedMap(data);
        case 'ImmutableList':
          return Immutable.List(data);
        case 'ImmutableRange':
          return Immutable.Range(data._start, data._end, data._step);
        case 'ImmutableRepeat':
          return Immutable.Repeat(data._value, data.size);
        case 'ImmutableSet':
          return Immutable.Set(data);
        case 'ImmutableOrderedSet':
          return Immutable.OrderedSet(data);
        case 'ImmutableSeq':
          return Immutable.Seq(data);
        case 'ImmutableStack':
          return Immutable.Stack(data);
        case 'ImmutableRecord':
          return refs && refs[value.__serializedRef__]
            ? new refs[value.__serializedRef__](data)
            : Immutable.Map(data);
        default:
          return data;
      }
    }
    return value;
  }

  return {
    replacer: customReplacer
      ? function (key, value) {
          return customReplacer(key, value, replacer);
        }
      : replacer,
    reviver: customReviver
      ? function (key, value) {
          return customReviver(key, value, reviver);
        }
      : reviver,
    options: options,
  };
};
