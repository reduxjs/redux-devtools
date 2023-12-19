import { map2tree, Node } from '../src/index.js';
import * as immutable from 'immutable';

test('# rootNodeKey', () => {
  const map = {};
  const options = { key: 'foo' };

  expect((map2tree(map, options) as Node).name).toBe('foo');
});

describe('# shallow map', () => {
  test('## null', () => {
    const map = {
      a: null,
    };

    const expected = {
      name: 'state',
      children: [{ name: 'a', value: null }],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## value', () => {
    const map = {
      a: 'foo',
      b: 'bar',
    };

    const expected = {
      name: 'state',
      children: [
        { name: 'a', value: 'foo' },
        { name: 'b', value: 'bar' },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## object', () => {
    const map = {
      a: { aa: 'foo' },
    };

    const expected = {
      name: 'state',
      children: [{ name: 'a', children: [{ name: 'aa', value: 'foo' }] }],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## immutable Map', () => {
    const map = {
      a: immutable.fromJS({ aa: 'foo', ab: 'bar' }),
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            { name: 'aa', value: 'foo' },
            { name: 'ab', value: 'bar' },
          ],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
  });
});

describe('# deep map', () => {
  test('## null', () => {
    const map = {
      a: { aa: null },
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            {
              name: 'aa',
              value: null,
            },
          ],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## object', () => {
    const map = {
      a: { aa: { aaa: 'foo' } },
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            {
              name: 'aa',
              children: [{ name: 'aaa', value: 'foo' }],
            },
          ],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });
});

describe('# array map', () => {
  const map = {
    a: [1, 2],
  };

  test('## push', () => {
    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            { name: 'a[0]', value: 1 },
            { name: 'a[1]', value: 2 },
          ],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## unshift', () => {
    const options = { pushMethod: 'unshift' as const };
    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            { name: 'a[1]', value: 2 },
            { name: 'a[0]', value: 1 },
          ],
        },
      ],
    };

    expect(map2tree(map, options)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map), options)).toEqual(expected);
  });

  test('## null', () => {
    const map = {
      a: [null],
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [{ name: 'a[0]', value: null }],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });
});

describe('# collection map', () => {
  test('## value', () => {
    const map = {
      a: [{ aa: 1 }, { aa: 2 }],
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [
            { name: 'a[0]', object: { aa: 1 } },
            { name: 'a[1]', object: { aa: 2 } },
          ],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });

  test('## object', () => {
    const map = {
      a: [{ aa: { aaa: 'foo' } }],
    };

    const expected = {
      name: 'state',
      children: [
        {
          name: 'a',
          children: [{ name: 'a[0]', object: { aa: { aaa: 'foo' } } }],
        },
      ],
    };

    expect(map2tree(map)).toEqual(expected);
    expect(map2tree(immutable.fromJS(map))).toEqual(expected);
  });
});
