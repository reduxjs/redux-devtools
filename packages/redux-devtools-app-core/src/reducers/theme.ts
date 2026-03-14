import { SchemeName, ThemeName } from '@redux-devtools/ui';
import { CHANGE_THEME } from '../constants/actionTypes.js';
import { CoreStoreAction } from '../actions/index.js';

export interface ThemeState {
  readonly theme: ThemeName;
  readonly scheme: SchemeName;
  readonly colorPreference: 'auto' | 'light' | 'dark';
}

export function theme(
  state: ThemeState = {
    theme: 'default',
    scheme: 'default',
    colorPreference: 'auto',
  },
  action: CoreStoreAction,
) {
  if (action.type === CHANGE_THEME) {
    return {
      theme: action.theme,
      scheme: action.scheme,
      colorPreference: action.colorPreference,
    };
  }
  return state;
}
