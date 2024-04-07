import {
  createStyling,
  invertBase16Theme,
  getBase16Theme,
} from '../src/index.js';
import { base16Themes, Base16Theme } from '../src/themes/index.js';
import { Styling, StylingConfig } from '../src/types.js';

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
  base01: '#FFFFFF',
  base02: '#A2A1A2',
  base03: '#807F80',
  base04: '#807F80',
  base05: '#5E5D5E',
  base06: '#3C3B3C',
  base07: '#1A191A',
  base08: '#FF4D4D',
  base09: '#CB6500',
  base0A: '#545400',
  base0B: '#A2A20A',
  base0C: '#0FA8A8',
  base0D: '#32CB32',
  base0E: '#6868CE',
  base0F: '#FF2AC3',
};

const apathyInverted = {
  author: 'jannik siebert (https://github.com/janniks)',
  base00: '#EFFFFF',
  base01: '#E3FFFF',
  base02: '#DAFFFF',
  base03: '#67A49A',
  base04: '#66A399',
  base05: '#51857C',
  base06: '#3C635D',
  base07: '#2A3F3C',
  base08: '#2F8779',
  base09: '#4E89A6',
  base0A: '#8391DB',
  base0B: '#B167BF',
  base0C: '#C8707E',
  base0D: '#A7994F',
  base0E: '#469038',
  base0F: '#3A9257',
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
