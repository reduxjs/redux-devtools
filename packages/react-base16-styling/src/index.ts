import { colord, extend, type Colord } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';
import namesPlugin from 'colord/plugins/names';
import oklchPlugin from 'colord/plugins/oklch';
import type * as CSS from 'csstype';
import { curry } from 'lodash-es';
import type { CurriedFunction3 } from 'lodash';
import type {
  Styling,
  StylingConfig,
  StylingFunction,
  StylingValue,
  StylingValueFunction,
  Theme,
} from './types.js';
import { base16Themes as base16 } from './themes/index.js';
import type { Base16Theme } from './themes/index.js';

extend([a11yPlugin, namesPlugin, oklchPlugin]);

const DEFAULT_BASE16 = base16.default;

const BASE16_KEYS = Object.keys(DEFAULT_BASE16);

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
  defaultStyling: StylingValue,
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
              ...args,
            );
        case 'object':
          return (styling, ...args) =>
            (customStyling as StylingValueFunction)(
              merger(styling)({
                style: defaultStyling as CSS.Properties<string | number>,
              }),
              ...args,
            );
        case 'function':
          return (styling, ...args) =>
            (customStyling as StylingValueFunction)(
              (defaultStyling as StylingValueFunction)(styling, ...args),
              ...args,
            );
      }
  }
};

const mergeStylings = (
  customStylings: StylingConfig,
  defaultStylings: StylingConfig,
): StylingConfig => {
  const keys = Object.keys(defaultStylings);
  for (const key in customStylings) {
    if (!keys.includes(key)) keys.push(key);
  }

  return keys.reduce(
    (mergedStyling, key) => (
      (mergedStyling[key as keyof StylingConfig] = mergeStyling(
        customStylings[key] as StylingValue,
        defaultStylings[key] as StylingValue,
      ) as StylingValue),
      mergedStyling
    ),
    {} as StylingConfig,
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
    { className: '', style: {} },
  );

  if (!props.className) {
    delete props.className;
  }

  if (Object.keys(props.style!).length === 0) {
    delete props.style;
  }

  return props;
};

// Flips a theme in OKLCH, where lightness matches how bright a color looks: shades
// (base00–07) swap ends, accents (base08–0F) keep their lightness, and everything
// except the backgrounds (base00–02) is then made readable on the new base00.
export const invertBase16Theme = (theme: Base16Theme): Base16Theme => {
  const l0 = colord(theme.base00).toOklch().l;
  const l7 = colord(theme.base07).toOklch().l;
  const end = l0 < 0.5 ? 1 : 0;
  // base00 and base07 of the same lightness leave no range to spread the shades over
  const range = l7 - l0 || 1;

  const flipShade = (value: string) => {
    const { l, c, h } = colord(value).toOklch();
    return colord({ l: end + ((l - l0) * (l0 - end)) / range, c, h, ok: true });
  };

  const background = flipShade(theme.base00).toHex();
  const step = end === 1 ? -0.01 : 0.01; // darken on a light background, lighten on a dark one

  const readable = (color: Colord) => {
    // check the hex that ends up in the theme: rounding can pull it just below AA
    while (!colord(color.toHex()).isReadable(background)) {
      color = color.lighten(step);
    }
    return color;
  };

  const inverted = { ...theme, scheme: `${theme.scheme}:inverted` };
  for (const key of Object.keys(theme) as (keyof Base16Theme)[]) {
    if (!key.startsWith('base')) continue;
    const isShade = /^base0[0-7]$/.test(key);
    const isBackground = /^base0[0-2]$/.test(key);
    let color = isShade ? flipShade(theme[key]) : colord(theme[key]);
    if (!isBackground) color = readable(color);
    inverted[key] = color.toHex().toUpperCase();
  }
  return inverted;
};

interface Options {
  defaultBase16?: Base16Theme;
  base16Themes?: { [themeName: string]: Base16Theme };
}

export const createStyling: CurriedFunction3<
  (base16Theme: Base16Theme) => StylingConfig,
  Options | undefined,
  Theme | undefined,
  StylingFunction
> = curry<
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
      {} as Base16Theme,
    );

    const customStyling = Object.keys(themeOrStyling).reduce(
      (s, key) =>
        !BASE16_KEYS.includes(key)
          ? ((s[key] = (themeOrStyling as StylingConfig)[key]), s)
          : s,
      {} as StylingConfig,
    );

    const defaultStyling = getStylingFromBase16(theme);

    const mergedStyling = mergeStylings(customStyling, defaultStyling);

    return curry(getStylingByKeys, 2)(mergedStyling, ...args);
  },
  3,
);

const isStylingConfig = (theme: Theme): theme is StylingConfig =>
  !!(theme as StylingConfig).extend;

export const getBase16Theme = (
  theme: Theme,
  base16Themes?: { [themeName: string]: Base16Theme } | null,
): Base16Theme | undefined => {
  if (theme && isStylingConfig(theme) && theme.extend) {
    theme = theme.extend as string | Base16Theme;
  }

  if (typeof theme === 'string') {
    const [themeName, modifier] = theme.split(':');
    if (base16Themes) {
      theme = base16Themes[themeName];
    } else {
      theme = base16[themeName as keyof typeof base16] as Base16Theme;
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

export type { Base16Theme };
export { base16 as base16Themes };
export * from './types.js';
