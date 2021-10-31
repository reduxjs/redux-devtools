import { Theme, Scheme } from '@redux-devtools/ui';
import {
  CHANGE_THEME,
  APPLY_MEDIA_FEATURES_PREFERENCES,
} from '../constants/actionTypes';
import { StoreAction } from '../actions';

export const defaultThemeColorPreference = 'auto';

export const themeColorPreferences = [
  defaultThemeColorPreference,
  'light',
  'dark',
] as const;

export type ThemeColorPreference = typeof themeColorPreferences[number];

export interface ThemeState {
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly light: boolean;
  readonly themeColorPreference?: ThemeColorPreference;
}

export default function theme(
  state: ThemeState = {
    theme: 'default' as const,
    scheme: 'default' as const,
    light: true,
    themeColorPreference: defaultThemeColorPreference,
  },
  action: StoreAction
) {
  if (action.type === CHANGE_THEME) {
    return {
      theme: action.theme,
      scheme: action.scheme,
      light: !action.dark,
      themeColorPreference: action.themeColorPreference,
    };
  }

  if (
    action.type === APPLY_MEDIA_FEATURES_PREFERENCES &&
    (!state.themeColorPreference ||
      state.themeColorPreference === defaultThemeColorPreference)
  ) {
    return {
      ...state,
      themeColorPreference:
        state.themeColorPreference ?? defaultThemeColorPreference,
      light: !action.prefersDarkColorScheme,
    };
  }

  return state;
}
