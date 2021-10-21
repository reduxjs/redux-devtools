import * as base16 from 'base16';
import { Base16Theme } from 'base16';
import Color from 'color';
import * as CSS from 'csstype';
import curry from 'lodash.curry';
import { Color as ColorTuple, yuv2rgb, rgb2yuv } from './colorConverters';
import {
  Styling,
  StylingConfig,
  StylingFunction,
  StylingValue,
  StylingValueFunction,
  Theme,
} from './types';

const DEFAULT_BASE16 = base16.default;

const BASE16_KEYS = Object.keys(DEFAULT_BASE16);

// we need a correcting factor, so that a dark, but not black background color
// converts to bright enough inversed color
const flip = (x: number) => (x < 0.25 ? 1 : x < 0.5 ? 0.9 - x : 1.1 - x);

const invertColor = (hexString: string) => {
  const color = Color(hexString);
  const [y, u, v] = rgb2yuv(color.array() as ColorTuple);
  const flippedYuv: ColorTuple = [flip(y), u, v];
  const rgb = yuv2rgb(flippedYuv);
  return Color.rgb(rgb).hex();
};

const merger = (styling: Partial<Styling>) => {
  return (prevStyling: Partial<Styling>) => ({
    className: [prevStyling.className, styling.className]
      .filter(Boolean)
      .join(' '),
    style: { ...(prevStyling.style || {}), ...(styling.style || {}) },
  });
};

const mergeStyling = (
  customStyling: StylingValue,
  defaultStyling: StylingValue
): StylingValue | undefined => {
  if (customStyling === undefined) {
    return defaultStyling;
  }
  if (defaultStyling === undefined) {
    return customStyling;
  }

  const customType = typeof customStyling;
  const defaultType = typeof defaultStyling;

  switch (customType) {
    case 'string':
      switch (defaultType) {
        case 'string':
          return [defaultStyling, customStyling].filter(Boolean).join(' ');
        case 'object':
          return merger({
            className: customStyling as string,
            style: defaultStyling as CSS.Properties<string | number>,
          });
        case 'function':
          return (styling: Styling, ...args: unknown[]) =>
            merger({
              className: customStyling as string,
            })((defaultStyling as StylingValueFunction)(styling, ...args));
      }
      break;
    case 'object':
      switch (defaultType) {
        case 'string':
          return merger({
            className: defaultStyling as string,
            style: customStyling as CSS.Properties<string | number>,
          });
        case 'object':
          return {
            ...(defaultStyling as CSS.Properties<string | number>),
            ...(customStyling as CSS.Properties<string | number>),
          };
        case 'function':
          return (styling: Styling, ...args: unknown[]) =>
            merger({
              style: customStyling as CSS.Properties<string | number>,
            })((defaultStyling as StylingValueFunction)(styling, ...args));
      }
      break;
    case 'function':
      switch (defaultType) {
        case 'string':
          return (styling, ...args) =>
            (customStyling as StylingValueFunction)(
              merger(styling)({
                className: defaultStyling as string,
              }),
              ...args
            );
        case 'object':
          return (styling, ...args) =>
            (customStyling as StylingValueFunction)(
              merger(styling)({
                style: defaultStyling as CSS.Properties<string | number>,
              }),
              ...args
            );
        case 'function':
          return (styling, ...args) =>
            (customStyling as StylingValueFunction)(
              (defaultStyling as StylingValueFunction)(
                styling,
                ...args
              ) as Styling,
              ...args
            );
      }
  }
};

const mergeStylings = (
  customStylings: StylingConfig,
  defaultStylings: StylingConfig
): StylingConfig => {
  const keys = Object.keys(defaultStylings);
  for (const key in customStylings) {
    if (keys.indexOf(key) === -1) keys.push(key);
  }

  return keys.reduce(
    (mergedStyling, key) => (
      (mergedStyling[key as keyof StylingConfig] = mergeStyling(
        customStylings[key] as StylingValue,
        defaultStylings[key] as StylingValue
      ) as StylingValue),
      mergedStyling
    ),
    {} as StylingConfig
  );
};

const getStylingByKeys = (
  mergedStyling: StylingConfig,
  keys: (string | false | undefined) | (string | false | undefined)[],
  ...args: unknown[]
): Styling => {
  if (keys === null) {
    return mergedStyling as unknown as Styling;
  }

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  const styles = keys
    .map((key) => mergedStyling[key as string])
    .filter(Boolean);

  const props = styles.reduce<Styling>(
    (obj, s) => {
      if (typeof s === 'string') {
        obj.className = [obj.className, s].filter(Boolean).join(' ');
      } else if (typeof s === 'object') {
        obj.style = { ...obj.style, ...s };
      } else if (typeof s === 'function') {
        obj = { ...obj, ...s(obj, ...args) };
      }

      return obj;
    },
    { className: '', style: {} }
  );

  if (!props.className) {
    delete props.className;
  }

  if (Object.keys(props.style!).length === 0) {
    delete props.style;
  }

  return props;
};

export const invertBase16Theme = (base16Theme: Base16Theme): Base16Theme =>
  Object.keys(base16Theme).reduce(
    (t, key) => (
      (t[key as keyof Base16Theme] = /^base/.test(key)
        ? invertColor(base16Theme[key as keyof Base16Theme])
        : key === 'scheme'
        ? base16Theme[key] + ':inverted'
        : base16Theme[key as keyof Base16Theme]),
      t
    ),
    {} as Base16Theme
  );

interface Options {
  defaultBase16?: Base16Theme;
  base16Themes?: { [themeName: string]: Base16Theme };
}

export const createStyling = curry<
  (base16Theme: Base16Theme) => StylingConfig,
  Options | undefined,
  Theme | undefined,
  StylingFunction
>(
  (
    getStylingFromBase16: (base16Theme: Base16Theme) => StylingConfig,
    options: Options = {},
    themeOrStyling: Theme = {},
    ...args
  ): StylingFunction => {
    const { defaultBase16 = DEFAULT_BASE16, base16Themes = null } = options;

    const base16Theme = getBase16Theme(themeOrStyling, base16Themes);
    if (base16Theme) {
      themeOrStyling = {
        ...base16Theme,
        ...(themeOrStyling as Base16Theme | StylingConfig),
      };
    }

    const theme = BASE16_KEYS.reduce(
      (t, key) => (
        (t[key as keyof Base16Theme] =
          (themeOrStyling as Base16Theme)[key as keyof Base16Theme] ||
          defaultBase16[key as keyof Base16Theme]),
        t
      ),
      {} as Base16Theme
    );

    const customStyling = Object.keys(themeOrStyling).reduce(
      (s, key) =>
        BASE16_KEYS.indexOf(key) === -1
          ? ((s[key] = (themeOrStyling as StylingConfig)[key]), s)
          : s,
      {} as StylingConfig
    );

    const defaultStyling = getStylingFromBase16(theme);

    const mergedStyling = mergeStylings(customStyling, defaultStyling);

    return curry(getStylingByKeys, 2)(mergedStyling, ...args);
  },
  3
);

const isStylingConfig = (theme: Theme): theme is StylingConfig =>
  !!(theme as StylingConfig).extend;

export const getBase16Theme = (
  theme: Theme,
  base16Themes?: { [themeName: string]: Base16Theme } | null
): Base16Theme | undefined => {
  if (theme && isStylingConfig(theme) && theme.extend) {
    theme = theme.extend as string | Base16Theme;
  }

  if (typeof theme === 'string') {
    const [themeName, modifier] = theme.split(':');
    if (base16Themes) {
      theme = base16Themes[themeName];
    } else {
      theme = base16[themeName as keyof typeof base16];
    }
    if (modifier === 'inverted') {
      theme = invertBase16Theme(theme);
    }
  }

  return theme && Object.prototype.hasOwnProperty.call(theme, 'base00')
    ? (theme as Base16Theme)
    : undefined;
};

export const invertTheme = (theme: Theme | undefined): Theme | undefined => {
  if (typeof theme === 'string') {
    return `${theme}:inverted`;
  }

  if (theme && isStylingConfig(theme) && theme.extend) {
    if (typeof theme.extend === 'string') {
      return { ...theme, extend: `${theme.extend}:inverted` };
    }

    return {
      ...theme,
      extend: invertBase16Theme(theme.extend as Base16Theme),
    };
  }

  if (theme) {
    return invertBase16Theme(theme as Base16Theme);
  }

  return theme;
};

export { Base16Theme };
export * from './types';
