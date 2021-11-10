import { Scheme, Theme } from '@redux-devtools/ui';
import { CHANGE_THEME } from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface ThemeState {
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly colorPreference: 'auto' | 'light' | 'dark';
}

export default function theme(
  state: ThemeState = {
    theme: 'default',
    scheme: 'default',
    colorPreference: 'auto',
  },
  action: StoreAction
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
