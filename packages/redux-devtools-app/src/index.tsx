import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import App from './containers/App';
import { StoreState } from './reducers';
import { StoreAction } from './actions';

export class Root extends Component {
  store?: Store<StoreState, StoreAction>;
  persistor?: Persistor;

  UNSAFE_componentWillMount() {
    const { store, persistor } = configureStore(
      (store: Store<StoreState, StoreAction>) => {
        if (store.getState().connection.type !== 'disabled') {
          store.dispatch({
            type: CONNECT_REQUEST,
          });
        }
      }
    );
    this.store = store;
    this.persistor = persistor;
  }

  render() {
    if (!this.store) return null;
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor!}>
          <App />
        </PersistGate>
      </Provider>
    );
  }
}

export * from './actions';
export { default as DispatcherButton } from './components/buttons/DispatcherButton';
export { default as ExportButton } from './components/buttons/ExportButton';
export { default as ImportButton } from './components/buttons/ImportButton';
export { default as PrintButton } from './components/buttons/PrintButton';
export { default as SliderButton } from './components/buttons/SliderButton';
export { default as Header } from './components/Header';
export { default as MonitorSelector } from './components/MonitorSelector';
export { default as Settings } from './components/Settings';
export { default as TopButtons } from './components/TopButtons';
export { default as DevTools } from './containers/DevTools';
export { default as Dispatcher } from './containers/monitors/Dispatcher';
export { default as SliderMonitor } from './containers/monitors/Slider';
export * from './constants/actionTypes';
export * from './constants/socketActionTypes';
export * from './middlewares/api';
export * from './middlewares/exportState';
export * from './reducers';
export * from './reducers/connection';
export * from './reducers/instances';
export * from './reducers/monitor';
export * from './reducers/notification';
export * from './reducers/reports';
export * from './reducers/section';
export * from './reducers/socket';
export * from './reducers/theme';
export * from './utils/monitorActions';
export * from './utils/stringifyJSON';
