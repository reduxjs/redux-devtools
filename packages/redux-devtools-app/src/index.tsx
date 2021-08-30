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

class Root extends Component {
  store?: Store<StoreState, StoreAction>;
  persistor?: Persistor;

  UNSAFE_componentWillMount() {
    const { store, persistor } = configureStore();
    this.store = store;
    this.persistor = persistor;
    store.dispatch({
      type: CONNECT_REQUEST,
    });
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

export default Root;
