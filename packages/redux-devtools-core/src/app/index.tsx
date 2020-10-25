import 'devui/lib/presets';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import configureStore from './store/configureStore';
import { CONNECT_REQUEST } from './constants/socketActionTypes';
import App from './containers/App';
import { StoreState } from './reducers';
import { ConnectionOptions, StoreAction } from './actions';

interface Props {
  socketOptions?: ConnectionOptions;
}

class Root extends Component<Props> {
  store?: Store<StoreState, StoreAction>;

  UNSAFE_componentWillMount() {
    configureStore((store, preloadedState) => {
      this.store = store;
      store.dispatch({
        type: CONNECT_REQUEST,
        options: (preloadedState!.connection ||
          this.props.socketOptions) as ConnectionOptions,
      });
      this.forceUpdate();
    });
  }

  render() {
    if (!this.store) return null;
    const AppAsAny = App as any;
    return (
      <Provider store={this.store}>
        <AppAsAny {...this.props} />
      </Provider>
    );
  }
}

export default Root;
