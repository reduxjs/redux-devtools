import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { Persistor } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from '@redux-devtools/app-core';
import { StoreState } from './reducers/index.js';
import { StoreAction } from './actions/index.js';
import { CONNECT_REQUEST } from './constants/socketActionTypes.js';
import Connection from './components/Settings/Connection.js';
import configureStore from './store/configureStore.js';

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
export * from './actions/index.js';
export * from './constants/socketActionTypes.js';
export * from './middlewares/api.js';
export * from './reducers/index.js';
export * from './reducers/connection.js';
export * from './reducers/socket.js';
export * from './utils/monitorActions.js';
