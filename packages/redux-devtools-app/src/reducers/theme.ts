import { Scheme, Theme } from '@redux-devtools/ui';
import {
  CHANGE_THEME,
  APPLY_MEDIA_FEATURES_PREFERENCES,
} from '../constants/actionTypes';
import { StoreAction } from '../actions';

export interface ThemeState {
  readonly theme: Theme;
  readonly scheme: Scheme;
  readonly light: boolean;
  readonly latestChangeBy?: string;
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
      latestChangeBy: CHANGE_THEME,
    };
  }

  if (
    action.type === APPLY_MEDIA_FEATURES_PREFERENCES &&
    state.latestChangeBy !== CHANGE_THEME
  ) {
    return {
      ...state,
      light: !action.prefersDarkColorScheme,
      latestChangeBy: APPLY_MEDIA_FEATURES_PREFERENCES,
    };
  }

  return state;
}
