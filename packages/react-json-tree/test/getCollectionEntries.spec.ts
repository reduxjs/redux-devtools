import getCollectionEntries from '../src/getCollectionEntries.js';

describe('getCollectionEntries', () => {
  it('returns one entry per index for a sparse array under the limit', () => {
    const entries = getCollectionEntries('Array', new Array(3), false, 50);
    expect(entries).toEqual([
      { key: 0, value: undefined },
      { key: 1, value: undefined },
      { key: 2, value: undefined },
    ]);
  });

  it('produces no undefined entries for a sparse array over the limit', () => {
    const entries = getCollectionEntries('Array', new Array(100), false, 50);
    expect(entries.every((entry) => entry !== undefined)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('produces no undefined entries for a sparse array range subset', () => {
    const entries = getCollectionEntries(
      'Array',
      new Array(100),
      false,
      50,
      46,
      95,
    );
    expect(entries.every((entry) => entry !== undefined)).toBe(true);
  });
});
