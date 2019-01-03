import { SHOW_NOTIFICATION, CLEAR_NOTIFICATION, LIFTED_ACTION, ERROR } from '../constants/actionTypes';

export default function notification(state = null, action) {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return action.notification;
    case ERROR:
      return { type: 'error', message: action.payload };
    case LIFTED_ACTION:
      return null;
    case CLEAR_NOTIFICATION:
      return null;
    default:
      return state;
  }
}
