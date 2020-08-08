import curry from 'lodash.curry';
import * as base16 from 'base16';
import rgb2hex from 'pure-color/convert/rgb2hex';
import parse from 'pure-color/parse';
import flow from 'lodash.flow';
import { yuv2rgb, rgb2yuv } from './colorConverters';

const DEFAULT_BASE16 = base16.default;

const BASE16_KEYS = Object.keys(DEFAULT_BASE16);

// we need a correcting factor, so that a dark, but not black background color
// converts to bright enough inversed color
const flip = (x) => (x < 0.25 ? 1 : x < 0.5 ? 0.9 - x : 1.1 - x);

const invertColor = flow(
  parse,
  rgb2yuv,
  ([y, u, v]) => [flip(y), u, v],
  yuv2rgb,
  rgb2hex
);

const merger = function merger(styling) {
  return (prevStyling) => ({
    className: [prevStyling.className, styling.className]
      .filter(Boolean)
      .join(' '),
    style: { ...(prevStyling.style || {}), ...(styling.style || {}) },
  });
};

const mergeStyling = function mergeStyling(customStyling, defaultStyling) {
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
          return merger({ className: customStyling, style: defaultStyling });
        case 'function':
          return (styling, ...args) =>
            merger({
              className: customStyling,
            })(defaultStyling(styling, ...args));
      }
      break;
    case 'object':
      switch (defaultType) {
        case 'string':
          return merger({ className: defaultStyling, style: customStyling });
        case 'object':
          return { ...defaultStyling, ...customStyling };
        case 'function':
          return (styling, ...args) =>
            merger({
              style: customStyling,
            })(defaultStyling(styling, ...args));
      }
      break;
    case 'function':
      switch (defaultType) {
        case 'string':
          return (styling, ...args) =>
            customStyling(
              merger(styling)({
                className: defaultStyling,
              }),
              ...args
            );
        case 'object':
          return (styling, ...args) =>
            customStyling(
              merger(styling)({
                style: defaultStyling,
              }),
              ...args
            );
        case 'function':
          return (styling, ...args) =>
            customStyling(defaultStyling(styling, ...args), ...args);
      }
  }
};

const mergeStylings = function mergeStylings(customStylings, defaultStylings) {
  const keys = Object.keys(defaultStylings);
  for (const key in customStylings) {
    if (keys.indexOf(key) === -1) keys.push(key);
  }

  return keys.reduce(
    (mergedStyling, key) => (
      (mergedStyling[key] = mergeStyling(
        customStylings[key],
        defaultStylings[key]
      )),
      mergedStyling
    ),
    {}
  );
};

const getStylingByKeys = (mergedStyling, keys, ...args) => {
  if (keys === null) {
    return mergedStyling;
  }

  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  const styles = keys.map((key) => mergedStyling[key]).filter(Boolean);

  const props = styles.reduce(
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

  if (Object.keys(props.style).length === 0) {
    delete props.style;
  }

  return props;
};

export const invertBase16Theme = (base16Theme) =>
  Object.keys(base16Theme).reduce(
    (t, key) => (
      (t[key] = /^base/.test(key)
        ? invertColor(base16Theme[key])
        : key === 'scheme'
        ? base16Theme[key] + ':inverted'
        : base16Theme[key]),
      t
    ),
    {}
  );

export const createStyling = curry(
  (getStylingFromBase16, options = {}, themeOrStyling = {}, ...args) => {
    const { defaultBase16 = DEFAULT_BASE16, base16Themes = null } = options;

    const base16Theme = getBase16Theme(themeOrStyling, base16Themes);
    if (base16Theme) {
      themeOrStyling = {
        ...base16Theme,
        ...themeOrStyling,
      };
    }

    const theme = BASE16_KEYS.reduce(
      (t, key) => ((t[key] = themeOrStyling[key] || defaultBase16[key]), t),
      {}
    );

    const customStyling = Object.keys(themeOrStyling).reduce(
      (s, key) =>
        BASE16_KEYS.indexOf(key) === -1
          ? ((s[key] = themeOrStyling[key]), s)
          : s,
      {}
    );

    const defaultStyling = getStylingFromBase16(theme);

    const mergedStyling = mergeStylings(customStyling, defaultStyling);

    return curry(getStylingByKeys, 2)(mergedStyling, ...args);
  },
  3
);

export const getBase16Theme = (theme, base16Themes) => {
  if (theme && theme.extend) {
    theme = theme.extend;
  }

  if (typeof theme === 'string') {
    const [themeName, modifier] = theme.split(':');
    theme = (base16Themes || {})[themeName] || base16[themeName];
    if (modifier === 'inverted') {
      theme = invertBase16Theme(theme);
    }
  }

  return theme && Object.prototype.hasOwnProperty.call(theme, 'base00')
    ? theme
    : undefined;
};

export const invertTheme = (theme) => {
  if (typeof theme === 'string') {
    return `${theme}:inverted`;
  }

  if (theme && theme.extend) {
    if (typeof theme.extend === 'string') {
      return { ...theme, extend: `${theme.extend}:inverted` };
    }

    return { ...theme, extend: invertBase16Theme(theme.extend) };
  }

  if (theme) {
    return invertBase16Theme(theme);
  }
};
