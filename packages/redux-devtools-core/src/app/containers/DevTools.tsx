import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import { LiftedAction, LiftedState } from 'redux-devtools-instrument';
import { Action } from 'redux';
import { Monitor } from 'redux-devtools';
import getMonitor from '../utils/getMonitor';
import { InitMonitorAction } from '../actions';

interface Props {
  monitor: string;
  dispatch: (
    action: LiftedAction<unknown, Action<unknown>, unknown> | InitMonitorAction
  ) => void;
}

class DevTools extends Component<Props> {
  monitorProps: unknown;
  Monitor?: Monitor<
    unknown,
    Action<unknown>,
    LiftedState<unknown, Action<unknown>, unknown>,
    unknown,
    Action<unknown>
  >;
  preventRender?: boolean;

  constructor(props: Props) {
    super(props);
    this.getMonitor(props, props.monitorState);
  }

  getMonitor(props: Props, skipUpdate: unknown) {
    const monitorElement = getMonitor(props);
    this.monitorProps = monitorElement.props;
    this.Monitor = monitorElement.type;

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
        newMonitorState = update(this.monitorProps, undefined, {});
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

  UNSAFE_componentWillUpdate(nextProps) {
    if (nextProps.monitor !== this.props.monitor) this.getMonitor(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.monitor !== this.props.monitor ||
      nextProps.liftedState !== this.props.liftedState ||
      nextProps.monitorState !== this.props.liftedState ||
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
    return (
      <div className={`monitor monitor-${this.props.monitor}`}>
        <this.Monitor
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

DevTools.propTypes = {
  liftedState: PropTypes.object,
  monitorState: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  monitor: PropTypes.string,
  features: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withTheme(DevTools);
