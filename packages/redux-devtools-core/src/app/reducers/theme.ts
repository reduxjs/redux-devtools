import { CHANGE_THEME } from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface ThemeState {
  readonly theme: 'default' | 'material';
  readonly scheme: string;
  readonly light: boolean;
}

export default function theme(
  state = { theme: 'default', scheme: 'default', light: true },
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
