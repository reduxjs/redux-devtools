import { createStore, applyMiddleware, PreloadedState } from 'redux';
import exportState from '@redux-devtools/app/lib/middlewares/exportState';
import panelDispatcher from '../middlewares/panelSync';
import rootReducer from '../reducers/panel';
import { StoreState } from '@redux-devtools/app/lib/reducers';

export default function configureStore(
  position: string,
  bgConnection: chrome.runtime.Port,
  preloadedState: PreloadedState<StoreState>
) {
  const enhancer = applyMiddleware(exportState, panelDispatcher(bgConnection));
  return createStore(rootReducer, preloadedState, enhancer);
}
