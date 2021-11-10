import { useEffect, useMemo, useState } from 'react';
import * as themes from '../themes';
import { nicinabox as defaultDarkScheme } from 'redux-devtools-themes';
import * as baseSchemes from 'base16';
import * as additionalSchemes from '../colorSchemes';
import invertColors from '../utils/invertColors';
import { Theme as ThemeBase } from '../themes/default';

export const schemes = { ...baseSchemes, ...additionalSchemes };
export const listSchemes = () => Object.keys(schemes).slice(1).sort(); // remove `__esModule`
export const listThemes = () => Object.keys(themes);

export type Theme = keyof typeof themes;
export type Scheme = keyof typeof schemes;

export interface ThemeData {
  theme: keyof typeof themes;
  scheme: keyof typeof schemes;
  colorPreference: 'auto' | 'light' | 'dark';
}

export interface ThemeFromProvider extends ThemeBase {
  type: keyof typeof themes;
  light: boolean;
}

const getTheme = (
  type: keyof typeof themes,
  scheme: keyof typeof schemes,
  light: boolean
): ThemeFromProvider => {
  let colors;
  if (scheme === 'default') {
    colors = light ? schemes.default : defaultDarkScheme;
  } else {
    colors = schemes[scheme];
    if (light) colors = invertColors(colors);
  }

  let theme = {
    type,
    light,
    ...themes.default(colors),
  };
  if (type !== 'default') {
    theme = { ...theme, ...themes[type](colors) };
  }

  return theme;
};

export const useTheme = ({
  theme: type,
  scheme,
  colorPreference,
}: ThemeData): ThemeFromProvider => {
  const [prefersDarkColorScheme, setPrefersDarkColorScheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = ({ matches }: MediaQueryListEvent) => {
      if (matches && !prefersDarkColorScheme) {
        setPrefersDarkColorScheme(true);
      }

      if (!matches && prefersDarkColorScheme) {
        setPrefersDarkColorScheme(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [prefersDarkColorScheme]);

  const light = useMemo(
    () =>
      colorPreference === 'auto'
        ? !prefersDarkColorScheme
        : colorPreference === 'light',
    [colorPreference, prefersDarkColorScheme]
  );

  return getTheme(type, scheme, light);
};
