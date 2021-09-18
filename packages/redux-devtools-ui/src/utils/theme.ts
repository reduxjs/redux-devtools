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
  light: boolean;
}

export interface ThemeFromProvider extends ThemeBase {
  type: keyof typeof themes;
  light: boolean;
}

export const getTheme = ({
  theme: type,
  scheme,
  light,
}: ThemeData): ThemeFromProvider => {
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
