import objType from '../src/objType.js';

describe('objType', () => {
  it('should determine the correct type', () => {
    expect(objType({})).toBe('Object');
    expect(objType([])).toBe('Array');
    expect(objType(new Map())).toBe('Map');
    expect(objType(new WeakMap())).toBe('WeakMap');
    expect(objType(new Set())).toBe('Set');
    expect(objType(new WeakSet())).toBe('WeakSet');
    expect(objType(new Error())).toBe('Error');
    expect(objType(new Date())).toBe('Date');
    expect(
      objType(() => {
        // noop
      }),
    ).toBe('Function');
    expect(objType('')).toBe('String');
    expect(objType(true)).toBe('Boolean');
    expect(objType(null)).toBe('Null');
    expect(objType(undefined)).toBe('Undefined');
    expect(objType(10)).toBe('Number');
    expect(objType(Symbol.iterator)).toBe('Symbol');
  });
});
