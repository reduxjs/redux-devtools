import {
  createStore,
  compose,
  applyMiddleware,
  Store,
  PreloadedState,
  StoreEnhancer,
} from 'redux';
import exportState from '@redux-devtools/app/lib/middlewares/exportState';
import api from '@redux-devtools/app/lib/middlewares/api';
import { CONNECT_REQUEST } from '@redux-devtools/app/lib/constants/socketActionTypes';
import { StoreState } from '@redux-devtools/app/lib/reducers';
import {
  StoreAction,
  StoreActionWithoutUpdateState,
  UpdateStateAction,
} from '@redux-devtools/app/lib/actions';
import { InstancesState } from '@redux-devtools/app/lib/reducers/instances';
import syncStores from '../middlewares/windowSync';
import instanceSelector from '../middlewares/instanceSelector';
import rootReducer from '../reducers/window';
import { BackgroundState } from '../reducers/background';
import { BackgroundAction } from './backgroundStore';
import { EmptyUpdateStateAction, NAAction } from '../middlewares/api';

export interface TogglePersistAction {
  readonly type: 'TOGGLE_PERSIST';
}

export type StoreActionWithTogglePersist = StoreAction | TogglePersistAction;

export interface ExpandedUpdateStateAction extends UpdateStateAction {
  readonly instances: InstancesState;
}

export type WindowStoreAction =
  | StoreActionWithoutUpdateState
  | TogglePersistAction
  | ExpandedUpdateStateAction
  | NAAction
  | EmptyUpdateStateAction;

export default function configureStore(
  baseStore: Store<BackgroundState, BackgroundAction>,
  position: string,
  preloadedState: PreloadedState<StoreState>
) {
  let enhancer: StoreEnhancer;
  const middlewares = [exportState, api, syncStores(baseStore)];
  if (!position || position === '#popup') {
    // select current tab instance for devPanel and pageAction
    middlewares.push(instanceSelector);
  }
  if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(...middlewares);
  } else {
    enhancer = compose(
      applyMiddleware(...middlewares),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : (noop: unknown) => noop
    );
  }
  const store = createStore(rootReducer, preloadedState, enhancer);

  chrome.storage.local.get(['s:hostname', 's:port', 's:secure'], (options) => {
    if (!options['s:hostname'] || !options['s:port']) return;
    store.dispatch({
      type: CONNECT_REQUEST,
      options: {
        hostname: options['s:hostname'],
        port: options['s:port'],
        secure: options['s:secure'],
      } as any,
    });
  });

  return store;
}
