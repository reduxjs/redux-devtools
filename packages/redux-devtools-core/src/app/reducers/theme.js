import { CHANGE_THEME } from '../constants/actionTypes';

export default function theme(
  state = { theme: 'default', scheme: 'default', light: true },
  action
) {
  if (action.type === CHANGE_THEME) {
    return {
      theme: action.theme,
      scheme: action.scheme,
      light: !action.dark
    };
  }
  return state;
}
