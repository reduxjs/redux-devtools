import { Scheme, Theme } from 'devui';
import { CHANGE_THEME } from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface ThemeState {
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly light: boolean;
}

export default function theme(
  state: ThemeState = {
    theme: 'default' as const,
    scheme: 'default' as const,
    light: true,
  },
  action: StoreAction
) {
  if (action.type === CHANGE_THEME) {
    return {
      theme: action.theme,
      scheme: action.scheme,
      light: !action.dark,
    };
  }
  return state;
}
