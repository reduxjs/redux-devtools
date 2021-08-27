import Immutable, { Map, OrderedMap } from 'immutable';
import Serialize from '../src/immutable';
import { SerializedData } from '../src/helpers';
const serialize = Serialize(Immutable);
const stringify = serialize.stringify;
const parse = serialize.parse;

const data = {
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
  const stringified: { [key: string]: string } = {};
  describe('Stringify', function () {
    Object.keys(data).forEach(function (key) {
      // eslint-disable-next-line jest/valid-title
      it(key, function () {
        stringified[key] = stringify(data[key as keyof typeof data]);
        expect(stringified[key]).toMatchSnapshot();
      });
    });
  });

  describe('Parse', function () {
    Object.keys(data).forEach(function (key) {
      // eslint-disable-next-line jest/valid-title
      it(key, function () {
        expect(parse(stringified[key])).toEqual(data[key as keyof typeof data]);
      });
    });
  });

  describe('Record', function () {
    const ABRecord = Immutable.Record({ a: 1, b: 2 });
    const myRecord = new ABRecord({ b: 3 });

    const serialize = Serialize(Immutable, [ABRecord]);
    const stringify = serialize.stringify;
    const parse = serialize.parse;
    let stringifiedRecord: string;

    it('stringify', function () {
      stringifiedRecord = stringify(myRecord);
      expect(stringifiedRecord).toMatchSnapshot();
    });

    it('parse', function () {
      expect(parse(stringifiedRecord)).toEqual(myRecord);
    });
  });

  describe('Nested', function () {
    const ABRecord = Immutable.Record({
      map: Immutable.OrderedMap({ seq: data.seq, stack: data.stack }),
      repeat: data.repeat,
    });
    const nestedData = Immutable.Set([ABRecord(), data.orderedSet, data.range]);

    const serialize = Serialize(Immutable, [ABRecord]);
    const stringify = serialize.stringify;
    const parse = serialize.parse;
    let stringifiedNested: string;

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
      const sharedValue: unknown[] = [];
      const record = Immutable.Record({
        prop: sharedValue,
      });

      const refs = [record];

      const obj = Immutable.Map({
        fst: new record(),
        scnd: new record(),
      });

      const serialize = Serialize(Immutable, refs);
      const serialized = serialize.stringify(obj);
      const parsed = JSON.parse(serialized);

      const fstProp = parsed.data.fst.data.prop;
      const scndProp = parsed.data.scnd.data.prop;

      expect(fstProp).toEqual(scndProp);
      expect(Array.isArray(obj.get('fst')!.get('prop'))).toBe(true);
    });
  });

  describe('Custom replacer and reviver functions', function () {
    const customOneRepresentation = 'one';

    function customReplacer(
      key: string,
      value: unknown,
      defaultReplacer: (key: string, value: unknown) => unknown
    ) {
      if (value === 1) {
        return { data: customOneRepresentation, __serializedType__: 'number' };
      }
      return defaultReplacer(key, value);
    }

    function customReviver(
      key: string,
      value: unknown,
      defaultReviver: (key: string, value: unknown) => unknown
    ) {
      if (
        typeof value === 'object' &&
        (value as SerializedData).__serializedType__ === 'number' &&
        (value as SerializedData).data === customOneRepresentation
      ) {
        return 1;
      }
      return defaultReviver(key, value);
    }

    const serializeCustom = Serialize(
      Immutable,
      null,
      customReplacer,
      customReviver
    );

    Object.keys(data).forEach(function (key) {
      const stringified = serializeCustom.stringify(
        data[key as keyof typeof data]
      );
      // eslint-disable-next-line jest/valid-title
      it(key, function () {
        const deserialized = serializeCustom.parse(stringified);
        expect(deserialized).toEqual(data[key as keyof typeof data]);
        if (key === 'map' || key === 'orderedMap') {
          const deserializedDefault = parse(stringified);
          // eslint-disable-next-line jest/no-conditional-expect
          expect(
            (
              deserializedDefault as
                | Map<unknown, unknown>
                | OrderedMap<unknown, unknown>
            ).get('a')
          ).toEqual(customOneRepresentation);
        }
      });
    });
  });
});
