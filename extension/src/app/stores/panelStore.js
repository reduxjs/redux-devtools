import { createStore, applyMiddleware } from 'redux';
import exportState from '@redux-devtools/app/lib/middlewares/exportState';
import panelDispatcher from '../middlewares/panelSync';
import rootReducer from '../reducers/panel';

export default function configureStore(position, bgConnection, preloadedState) {
  const enhancer = applyMiddleware(exportState, panelDispatcher(bgConnection));
  return createStore(rootReducer, preloadedState, enhancer);
}
