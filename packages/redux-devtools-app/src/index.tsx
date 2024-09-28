import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from '@redux-devtools/app-core';
import { StoreState } from './reducers';
import { StoreAction } from './actions';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import Connection from './components/Settings/Connection';
import configureStore from './store/configureStore';

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
      },
    );
    this.store = store;
    this.persistor = persistor;
  }

  render() {
    if (!this.store) return null;
    return (
      <Provider store={this.store}>
        <PersistGate loading={null} persistor={this.persistor!}>
          <App
            extraSettingsTabs={[{ name: 'Connection', component: Connection }]}
          />
        </PersistGate>
      </Provider>
    );
  }
}

export * from '@redux-devtools/app-core';
export * from './actions';
export * from './constants/socketActionTypes';
export * from './middlewares/api';
export * from './reducers';
export * from './reducers/connection';
export * from './reducers/socket';
export * from './utils/monitorActions';
