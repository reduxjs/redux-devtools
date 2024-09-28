import {
  SHOW_NOTIFICATION,
  CLEAR_NOTIFICATION,
  LIFTED_ACTION,
  ERROR,
} from '../constants/actionTypes';
import { CoreStoreAction } from '../actions';

interface Notification {
  readonly type: 'error';
  readonly message: string;
}
export type NotificationState = Notification | null;

export function notification(
  state: NotificationState = null,
  action: CoreStoreAction,
): NotificationState {
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
