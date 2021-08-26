import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Action, AnyAction } from 'redux';
import RtkQueryInspector from './RtkQueryInspector';
import { reducer } from '../reducers';
import {
  ExternalProps,
  RtkQueryMonitorProps,
  RtkQueryMonitorState,
  StyleUtils,
} from '../types';
import {
  createThemeState,
  StyleUtilsContext,
} from '../styles/createStylingFromTheme';

interface DefaultProps {
  theme: string;
  invertTheme: boolean;
}

export interface RtkQueryComponentState {
  readonly styleUtils: StyleUtils;
}

class RtkQueryMonitor<S, A extends Action<unknown>> extends Component<
  RtkQueryMonitorProps<S, A>,
  RtkQueryComponentState
> {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    currentStateIndex: PropTypes.number,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.object,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    invertTheme: PropTypes.bool,
  };

  static defaultProps: DefaultProps = {
    theme: 'nicinabox',
    invertTheme: false,
  };

  constructor(props: RtkQueryMonitorProps<S, A>) {
    super(props);

    this.state = {
      styleUtils: createThemeState<S, A>(props),
    };
  }

  render() {
    const {
      currentStateIndex,
      computedStates,
      monitorState,
      dispatch,
      actionsById,
    } = this.props;

    return (
      <StyleUtilsContext.Provider value={this.state.styleUtils}>
        <RtkQueryInspector<S, AnyAction>
          computedStates={computedStates}
          currentStateIndex={currentStateIndex}
          monitorState={monitorState}
          dispatch={dispatch}
          styleUtils={this.state.styleUtils}
          actionsById={actionsById}
        />
      </StyleUtilsContext.Provider>
    );
  }
}

export default RtkQueryMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<unknown>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<unknown>>,
    state: RtkQueryMonitorState | undefined,
    action: Action
  ): RtkQueryMonitorState;
  defaultProps: DefaultProps;
};
