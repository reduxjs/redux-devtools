import {
  createStyling,
  invertBase16Theme,
  getBase16Theme,
} from '../src/index.js';
import type { Base16Theme } from '../src/themes/index.js';
import { base16Themes } from '../src/themes/index.js';
import type { Styling, StylingConfig } from '../src/types.js';

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
  base00: '#FFFFFF',
  base01: '#ADADAD',
  base02: '#848484',
  base03: '#606060',
  base04: '#323232',
  base05: '#181818',
  base06: '#040404',
  base07: '#000000',
  base08: '#EB0000',
  base09: '#A86500',
  base0A: '#7A7A00',
  base0B: '#7A7A00',
  base0C: '#008080',
  base0D: '#008A00',
  base0E: '#6161FF',
  base0F: '#E00087',
};

const apathyInverted = {
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#EAFFFF',
  base01: '#BBE6DB',
  base02: '#91C7BB',
  base03: '#487B71',
  base04: '#306E65',
  base05: '#1D514A',
  base06: '#103430',
  base07: '#081917',
  base08: '#358074',
  base09: '#3E7996',
  base0A: '#3E4C96',
  base0B: '#883E96',
  base0C: '#963E4C',
  base0D: '#807435',
  base0E: '#418035',
  base0F: '#35804E',
  scheme: 'apathy:inverted',
};

const getStylingFromBase16 = (base16: Base16Theme): StylingConfig => ({
  testClass: 'testClass',
  testStyle: {
    color: base16.base00,
  },
  testFunc: ({ style }, arg) => ({
    className: `testClass--${arg as string}`,
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
  testFuncNoStyle: (_, arg) => ({
    className: `testClass--${arg as string}`,
  }),
});

test('invertTheme', () => {
  expect(invertBase16Theme(base16Theme)).toEqual(invertedBase16Theme);
});

test('invertTheme (single-color theme)', () => {
  // base00 and base07 of the same lightness leave no range to flip the shades over
  const flat: Base16Theme = { ...base16Theme };
  for (const key of Object.keys(flat) as (keyof Base16Theme)[]) {
    if (key.startsWith('base')) flat[key] = '#333333';
  }
  expect(invertBase16Theme(flat).base00).toBe('#FFFFFF');
});

test('getBase16Theme', () => {
  expect(getBase16Theme('apathy')).toEqual(base16Themes.apathy);
  expect(getBase16Theme({ extend: 'apathy' })).toEqual(base16Themes.apathy);
  expect(getBase16Theme('apathy:inverted')).toEqual(apathyInverted);
  expect(getBase16Theme({})).toBeUndefined();
});

test('createStyling (default)', () => {
  const styling = createStyling(getStylingFromBase16, {
    defaultBase16: base16Themes.apathy,
  });
  const defaultStyling = styling(undefined);

  expect(defaultStyling('testClass')).toEqual({ className: 'testClass' });
  expect(defaultStyling('testStyle')).toEqual({
    style: { color: base16Themes.apathy.base00 },
  });
  expect(defaultStyling('testFunc', 'mod')).toEqual({
    className: 'testClass--mod',
    style: {
      width: 0,
      color: base16Themes.apathy.base00,
    },
  });
});

test('createStyling (custom)', () => {
  const styling = createStyling(getStylingFromBase16, {
    defaultBase16: base16Themes.apathy,
  });
  let customStyling = styling({
    testClass: 'customClass',
    testStyle: { height: 0 },
    testFunc: (styling: Styling, arg) => ({
      className: `${styling.className!} customClass--${arg as string}`,
      style: {
        ...styling.style,
        border: 0,
      },
    }),
    testFuncNoStyle: (styling: Styling, arg) => ({
      className: `${styling.className!} customClass--${arg as string}`,
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
    style: { color: base16Themes.apathy.base00, height: 0 },
  });
  expect(customStyling('testFunc', 'mod')).toEqual({
    className: 'testClass--mod customClass--mod',
    style: {
      width: 0,
      color: base16Themes.apathy.base00,
      border: 0,
    },
  });
  expect(customStyling('testFuncNoStyle', 'mod')).toEqual({
    className: 'testClass--mod customClass--mod',
    style: {
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
    defaultBase16: base16Themes.apathy,
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
