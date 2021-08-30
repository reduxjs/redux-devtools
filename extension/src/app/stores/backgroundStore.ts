import { createStore, applyMiddleware, PreloadedState } from 'redux';
import rootReducer, { BackgroundState } from '../reducers/background';
import api, { CONNECTED, DISCONNECTED } from '../middlewares/api';
import { LIFTED_ACTION } from '@redux-devtools/app/lib/constants/actionTypes';
import {
  CustomAction,
  DispatchAction,
  StoreActionWithoutLiftedAction,
} from '@redux-devtools/app/lib/actions';

interface LiftedActionActionBase {
  action?: DispatchAction | string | CustomAction;
  state?: string;
  toAll?: boolean;
  readonly instanceId: string | number;
  readonly id: string | number | undefined;
}
interface LiftedActionDispatchAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'DISPATCH';
  action: DispatchAction;
  toAll?: boolean;
}
interface LiftedActionImportAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'IMPORT';
  state: string;
  preloadedState?: unknown | undefined;
  action?: never;
}
interface LiftedActionActionAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'ACTION';
  action: string | CustomAction;
}
interface LiftedActionExportAction extends LiftedActionActionBase {
  type: typeof LIFTED_ACTION;
  message: 'EXPORT';
  toExport: boolean;
  action?: never;
}
export type LiftedActionAction =
  | LiftedActionDispatchAction
  | LiftedActionImportAction
  | LiftedActionActionAction
  | LiftedActionExportAction;

interface ConnectedAction {
  readonly type: typeof CONNECTED;
}

interface DisconnectedAction {
  readonly type: typeof DISCONNECTED;
}

export type BackgroundAction =
  | StoreActionWithoutLiftedAction
  | LiftedActionAction
  | ConnectedAction
  | DisconnectedAction;

export default function configureStore(
  preloadedState?: PreloadedState<BackgroundState>
) {
  return createStore(rootReducer, preloadedState, applyMiddleware(api));
  /*
  let enhancer;
  if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(api);
  } else {
    const logger = require('redux-logger');
    enhancer = applyMiddleware(api, logger());
  }

  return createStore(rootReducer, preloadedState, enhancer);
*/
}
