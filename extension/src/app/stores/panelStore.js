import { createStore, applyMiddleware } from 'redux';
import persist from 'remotedev-app/lib/middlewares/persist';
import exportState from 'remotedev-app/lib/middlewares/exportState';
import panelDispatcher from '../middlewares/panelSync';
import rootReducer from '../reducers/panel';

export default function configureStore(position, bgConnection, preloadedState) {
  const enhancer = applyMiddleware(exportState, panelDispatcher(bgConnection), persist(position));
  return createStore(rootReducer, preloadedState, enhancer);
}
