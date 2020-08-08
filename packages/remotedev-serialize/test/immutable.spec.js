var Immutable = require('immutable');
var Serialize = require('../immutable');
var serialize = Serialize(Immutable);
var stringify = serialize.stringify;
var parse = serialize.parse;

var data = {
  map: Immutable.Map({ a: 1, b: 2, c: 3, d: 4 }),
  orderedMap: Immutable.OrderedMap({ b: 2, a: 1, c: 3, d: 4 }),
  list: Immutable.List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
  range: Immutable.Range(0, 7),
  repeat: Immutable.Repeat('hi', 100),
  set: Immutable.Set([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
  orderedSet: Immutable.OrderedSet([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]),
  seq: Immutable.Seq([1, 2, 3, 4, 5, 6, 7, 8]),
  stack: Immutable.Stack.of('a', 'b', 'c'),
};

describe('Immutable', function () {
  var stringified = {};
  describe('Stringify', function () {
    Object.keys(data).forEach(function (key) {
      it(key, function () {
        stringified[key] = stringify(data[key]);
        expect(stringified[key]).toMatchSnapshot();
      });
    });
  });

  describe('Parse', function () {
    Object.keys(data).forEach(function (key) {
      it(key, function () {
        expect(parse(stringified[key])).toEqual(data[key]);
      });
    });
  });

  describe('Record', function () {
    var ABRecord = Immutable.Record({ a: 1, b: 2 });
    var myRecord = new ABRecord({ b: 3 });

    var serialize = Serialize(Immutable, [ABRecord]);
    var stringify = serialize.stringify;
    var parse = serialize.parse;
    var stringifiedRecord;

    it('stringify', function () {
      stringifiedRecord = stringify(myRecord);
      expect(stringifiedRecord).toMatchSnapshot();
    });

    it('parse', function () {
      expect(parse(stringifiedRecord)).toEqual(myRecord);
    });
  });

  describe('Nested', function () {
    var ABRecord = Immutable.Record({
      map: Immutable.OrderedMap({ seq: data.seq, stack: data.stack }),
      repeat: data.repeat,
    });
    var nestedData = Immutable.Set(ABRecord(), data.orderedSet, data.range);

    var serialize = Serialize(Immutable, [ABRecord]);
    var stringify = serialize.stringify;
    var parse = serialize.parse;
    var stringifiedNested;

    it('stringify', function () {
      stringifiedNested = stringify(nestedData);
      expect(stringifiedNested).toMatchSnapshot();
    });

    it('parse', function () {
      expect(parse(stringifiedNested)).toEqual(nestedData);
    });
  });
  describe('With references', function () {
    it('serializes and deserializes', function () {
      var sharedValue = [];
      var record = Immutable.Record({
        prop: sharedValue,
      });

      var refs = [record];

      var obj = Immutable.Map({
        fst: new record(),
        scnd: new record(),
      });

      var serialized = stringify(
        obj,
        Serialize(Immutable, refs).replacer,
        null,
        true
      );
      var parsed = JSON.parse(serialized);

      var fstProp = parsed.data.fst.data.prop;
      var scndProp = parsed.data.scnd.data.prop;

      expect(fstProp).toEqual(scndProp);
      expect(Array.isArray(obj.get('fst').get('prop')));
    });
  });

  describe('Custom replacer and reviver functions', function () {
    var customOneRepresentation = 'one';

    function customReplacer(key, value, defaultReplacer) {
      if (value === 1) {
        return { data: customOneRepresentation, __serializedType__: 'number' };
      }
      return defaultReplacer(key, value);
    }

    function customReviver(key, value, defaultReviver) {
      if (
        typeof value === 'object' &&
        value.__serializedType__ === 'number' &&
        value.data === customOneRepresentation
      ) {
        return 1;
      }
      return defaultReviver(key, value);
    }

    var serializeCustom = Serialize(
      Immutable,
      null,
      customReplacer,
      customReviver
    );

    Object.keys(data).forEach(function (key) {
      var stringified = serializeCustom.stringify(data[key]);
      it(key, function () {
        var deserialized = serializeCustom.parse(stringified);
        expect(deserialized).toEqual(data[key]);
        if (key === 'map' || key === 'orderedMap') {
          var deserializedDefault = parse(stringified);
          expect(deserializedDefault.get('a')).toEqual(customOneRepresentation);
        }
      });
    });
  });
});
