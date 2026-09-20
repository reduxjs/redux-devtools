import { stringify } from '../src/index.js';

describe('stringify', () => {
  it('serializes plain objects with JSON.stringify', () => {
    expect(stringify({ a: 1, b: [2, 3] })).toBe('{"a":1,"b":[2,3]}');
  });

  it('falls back to jsan for circular structures', () => {
    const obj: { self?: unknown; n: number } = { n: 1 };
    obj.self = obj;
    expect(JSON.parse(stringify(obj))).toEqual({ n: 1, self: '[CIRCULAR]' });
  });

  it('serializes BigInt as a "<digits>n" string in the default path', () => {
    expect(stringify({ big: 9007199254740993n })).toBe(
      '{"big":"9007199254740993n"}',
    );
  });

  it('serializes BigInt inside a circular structure', () => {
    const obj: { self?: unknown; big: bigint } = { big: 1n };
    obj.self = obj;
    expect(JSON.parse(stringify(obj))).toEqual({
      big: '1n',
      self: '[CIRCULAR]',
    });
  });

  it('serializes BigInt with serialize: true', () => {
    expect(JSON.parse(stringify({ big: 2n }, true))).toEqual({ big: '2n' });
  });

  it('serializes BigInt with a custom replacer', () => {
    const replacer = (key: string, value: unknown) =>
      key === 'drop' ? undefined : value;
    expect(JSON.parse(stringify({ big: 3n, drop: 'x' }, { replacer }))).toEqual(
      { big: '3n' },
    );
  });
});
