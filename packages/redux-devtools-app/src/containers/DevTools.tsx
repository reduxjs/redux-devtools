import React, { Component } from 'react';
import { withTheme } from 'styled-components';
import { LiftedAction, LiftedState } from '@redux-devtools/core';
import { Action } from 'redux';
import getMonitor from '../utils/getMonitor';
import { InitMonitorAction } from '../actions';
import { Features, State } from '../reducers/instances';
import { MonitorStateMonitorState } from '../reducers/monitor';
import { ThemeFromProvider } from '@redux-devtools/ui';

interface Props {
  monitor: string;
  liftedState: State;
  monitorState: MonitorStateMonitorState | undefined;
  dispatch: (
    action: LiftedAction<unknown, Action<unknown>, unknown> | InitMonitorAction
  ) => void;
  features: Features | undefined;
  theme: ThemeFromProvider;
}

class DevTools extends Component<Props> {
  monitorProps: unknown;
  Monitor?: React.ComponentType<
    LiftedState<unknown, Action<unknown>, unknown>
  > & {
    update(
      monitorProps: unknown,
      state: unknown | undefined,
      action: Action<unknown>
    ): unknown;
  };
  preventRender?: boolean;

  constructor(props: Props) {
    super(props);
    this.getMonitor(props, props.monitorState);
  }

  getMonitor(props: Props, skipUpdate?: unknown) {
    const monitorElement = getMonitor(props);
    this.monitorProps = monitorElement.props;
    this.Monitor = monitorElement.type;

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const update = this.Monitor!.update;
    if (update) {
      let newMonitorState;
      const monitorState = props.monitorState;
      if (
        skipUpdate ||
        (monitorState && monitorState.__overwritten__ === props.monitor)
      ) {
        newMonitorState = monitorState;
      } else {
        newMonitorState = update(
          this.monitorProps,
          undefined,
          {} as Action<unknown>
        );
        if (newMonitorState !== monitorState) {
          this.preventRender = true;
        }
      }
      this.dispatch({
        type: '@@INIT_MONITOR',
        newMonitorState,
        update,
        monitorProps: this.monitorProps,
      });
    }
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    if (nextProps.monitor !== this.props.monitor) this.getMonitor(nextProps);
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.monitorState !== this.props.monitorState ||
      nextProps.features !== this.props.features ||
      nextProps.theme.scheme !== this.props.theme.scheme
    );
  }

  dispatch = (
    action: LiftedAction<unknown, Action<unknown>, unknown> | InitMonitorAction
  ) => {
    this.props.dispatch(action);
  };

  render() {
    if (this.preventRender) {
      this.preventRender = false;
      return null;
    }

    const liftedState = {
      ...this.props.liftedState,
      monitorState: this.props.monitorState,
    };
    const MonitorAsAny = this.Monitor as any;
    return (
      <div className={`monitor monitor-${this.props.monitor}`}>
        <MonitorAsAny
          {...liftedState}
          {...this.monitorProps}
          features={this.props.features}
          dispatch={this.dispatch}
          theme={this.props.theme}
        />
      </div>
    );
  }
}

export default withTheme(DevTools);
