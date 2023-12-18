import React, { Children, Component } from 'react';
import { connect, Provider, ReactReduxContext } from 'react-redux';
import {
  instrument,
  EnhancedStore,
  LiftedState,
  LiftedStore,
  Options,
} from '@redux-devtools/instrument';
import { Action } from 'redux';

function logError(type: string) {
  if (type === 'NoStore') {
    console.error(
      'Redux DevTools could not render. You must pass the Redux store ' +
        'to <DevTools> either as a "store" prop or by wrapping it in a ' +
        '<Provider store={store}>.',
    );
  } else {
    console.error(
      'Redux DevTools could not render. Did you forget to include ' +
        'DevTools.instrument() in your store enhancer chain before ' +
        'using createStore()?',
    );
  }
}

export interface Props<S, A extends Action<string>, MonitorState> {
  store?: EnhancedStore<S, A, MonitorState>;
}

export type Monitor<
  S,
  A extends Action<string>,
  MonitorProps extends LiftedState<S, A, MonitorState>,
  MonitorState,
  MonitorAction extends Action<string>,
> = React.ReactElement<
  MonitorProps,
  React.ComponentType<MonitorProps & LiftedState<S, A, MonitorState>> & {
    update(
      monitorProps: MonitorProps,
      state: MonitorState | undefined,
      action: MonitorAction,
    ): MonitorState;
  }
>;

export default function createDevTools<
  S,
  A extends Action<string>,
  MonitorProps extends LiftedState<S, A, MonitorState>,
  MonitorState,
  MonitorAction extends Action<string>,
>(children: Monitor<S, A, MonitorProps, MonitorState, MonitorAction>) {
  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const ConnectedMonitor = connect(
    (state: LiftedState<S, A, MonitorState>) => state,
  )(Monitor as React.ComponentType<any>);

  return class DevTools extends Component<Props<S, A, MonitorState>> {
    liftedStore?: LiftedStore<S, A, MonitorState>;

    static instrument = (
      options?: Options<S, A, MonitorState, MonitorAction>,
    ) =>
      instrument(
        (state, action) => Monitor.update(monitorProps, state, action),
        options,
      );

    constructor(props: Props<S, A, MonitorState>) {
      super(props);

      if (ReactReduxContext) {
        if (this.props.store && !this.props.store.liftedStore) {
          logError('NoLiftedStore');
        }
        return;
      }

      if (!props.store) {
        logError('NoStore');
        return;
      }

      this.liftedStore = props.store.liftedStore;

      if (!this.liftedStore) {
        logError('NoLiftedStore');
      }
    }

    render() {
      if (ReactReduxContext) {
        // For react-redux@6
        if (this.props.store) {
          if (!this.props.store.liftedStore) {
            return null;
          }
          return (
            <Provider store={this.props.store.liftedStore}>
              <ConnectedMonitor {...monitorProps} />
            </Provider>
          );
        }
        return (
          <ReactReduxContext.Consumer>
            {(props) => {
              if (!props || !props.store) {
                logError('NoStore');
                return null;
              }
              if (
                !(props.store as unknown as EnhancedStore<S, A, MonitorState>)
                  .liftedStore
              ) {
                logError('NoLiftedStore');
                return null;
              }
              return (
                <Provider
                  store={
                    (
                      props.store as unknown as EnhancedStore<
                        S,
                        A,
                        MonitorState
                      >
                    ).liftedStore
                  }
                >
                  <ConnectedMonitor {...monitorProps} />
                </Provider>
              );
            }}
          </ReactReduxContext.Consumer>
        );
      }

      if (!this.liftedStore) {
        return null;
      }

      return <ConnectedMonitor {...monitorProps} store={this.liftedStore} />;
    }
  };
}
