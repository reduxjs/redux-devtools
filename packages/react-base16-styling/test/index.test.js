import { createStyling, invertBase16Theme, getBase16Theme } from '../src';
import apathy from 'base16/lib/apathy';

const base16Theme = {
  scheme: 'myscheme',
  author: 'me',
  base00: '#000000',
  base01: '#222222',
  base02: '#444444',
  base03: '#666666',
  base04: '#999999',
  base05: '#bbbbbb',
  base06: '#dddddd',
  base07: '#ffffff',
  base08: '#ff0000',
  base09: '#ff9900',
  base0A: '#ffff00',
  base0B: '#999900',
  base0C: '#009999',
  base0D: '#009900',
  base0E: '#9999ff',
  base0F: '#ff0099',
};

const invertedBase16Theme = {
  scheme: 'myscheme:inverted',
  author: 'me',
  base00: '#ffffff',
  base01: '#ffffff',
  base02: '#a2a1a2',
  base03: '#807f80',
  base04: '#807f80',
  base05: '#5e5d5e',
  base06: '#3c3b3c',
  base07: '#1a191a',
  base08: '#ff4d4d',
  base09: '#cb6500',
  base0A: '#545400',
  base0B: '#a2a20a',
  base0C: '#0fa8a8',
  base0D: '#32cb32',
  base0E: '#6868ce',
  base0F: '#ff2ac3',
};

const apathyInverted = {
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#efffff',
  base01: '#e3ffff',
  base02: '#daffff',
  base03: '#67a49a',
  base04: '#66a399',
  base05: '#51857c',
  base06: '#3c635d',
  base07: '#2a3f3c',
  base08: '#2f8779',
  base09: '#4e89a6',
  base0A: '#8391db',
  base0B: '#b167bf',
  base0C: '#c8707e',
  base0D: '#a7994f',
  base0E: '#469038',
  base0F: '#3a9257',
  scheme: 'apathy:inverted',
};

const getStylingFromBase16 = (base16) => ({
  testClass: 'testClass',
  testStyle: {
    color: base16.base00,
  },
  testFunc: ({ style }, arg) => ({
    className: 'testClass--' + arg,
    style: {
      ...style,
      width: 0,
      color: base16.base00,
    },
  }),
  baseStyle: {
    color: 'red',
  },
  additionalStyle: {
    border: 0,
  },
});

test('invertTheme', () => {
  expect(invertBase16Theme(base16Theme)).toEqual(invertedBase16Theme);
});

test('getBase16Theme', () => {
  expect(getBase16Theme('apathy')).toEqual(apathy);
  expect(getBase16Theme({ extend: 'apathy' })).toEqual(apathy);
  expect(getBase16Theme('apathy:inverted')).toEqual(apathyInverted);
  expect(getBase16Theme({})).toBe(undefined);
});

test('createStyling (default)', () => {
  const styling = createStyling(getStylingFromBase16, {
    defaultBase16: apathy,
  });
  const defaultStyling = styling(undefined);

  expect(defaultStyling('testClass')).toEqual({ className: 'testClass' });
  expect(defaultStyling('testStyle')).toEqual({
    style: { color: apathy.base00 },
  });
  expect(defaultStyling('testFunc', 'mod')).toEqual({
    className: 'testClass--mod',
    style: {
      width: 0,
      color: apathy.base00,
    },
  });
});

test('createStyling (custom)', () => {
  const styling = createStyling(getStylingFromBase16, {
    defaultBase16: apathy,
  });
  let customStyling = styling({
    testClass: 'customClass',
    testStyle: { height: 0 },
    testFunc: (styling, arg) => ({
      className: styling.className + ' customClass--' + arg,
      style: {
        ...styling.style,
        border: 0,
      },
    }),
  });

  expect(customStyling('testClass')).toEqual({
    className: 'testClass customClass',
  });
  expect(customStyling('testStyle')).toEqual({
    style: { color: apathy.base00, height: 0 },
  });
  expect(customStyling('testFunc', 'mod')).toEqual({
    className: 'testClass--mod customClass--mod',
    style: {
      width: 0,
      color: apathy.base00,
      border: 0,
    },
  });

  customStyling = styling({
    testClass: () => ({
      className: 'customClass',
    }),
    testStyle: () => ({
      style: {
        border: 0,
      },
    }),
  });

  expect(customStyling('testClass')).toEqual({ className: 'customClass' });
  expect(customStyling('testStyle')).toEqual({ style: { border: 0 } });
});

test('createStyling (multiple)', () => {
  const styling = createStyling(getStylingFromBase16, {
    defaultBase16: apathy,
  });
  let customStyling = styling({
    baseStyle: ({ style }) => ({ style: { ...style, color: 'blue' } }),
  });

  expect(customStyling(['baseStyle', 'additionalStyle'])).toEqual({
    style: {
      color: 'blue',
      border: 0,
    },
  });

  customStyling = styling({
    additionalStyle: ({ style }) => ({ style: { ...style, border: 1 } }),
  });

  expect(customStyling(['baseStyle', 'additionalStyle'])).toEqual({
    style: {
      color: 'red',
      border: 1,
    },
  });
});
