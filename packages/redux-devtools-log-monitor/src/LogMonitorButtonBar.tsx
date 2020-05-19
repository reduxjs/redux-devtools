import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Action, Dispatch } from 'redux';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { Base16Theme } from 'base16';
import { ActionCreators, LiftedAction } from 'redux-devtools';
import LogMonitorButton from './LogMonitorButton';
import { LogMonitorAction } from './actions';
import { LogMonitorState } from './reducers';

const { reset, rollback, commit, sweep } = ActionCreators;

const style: React.CSSProperties = {
  textAlign: 'center',
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderColor: 'transparent',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'row'
};

interface Props<S, A extends Action> {
  theme: Base16Theme;
  dispatch: Dispatch<
    LogMonitorAction | LiftedAction<S, A, LogMonitorState, LogMonitorAction>
  >;
  hasStates: boolean;
  hasSkippedActions: boolean;
}

export default class LogMonitorButtonBar<S, A extends Action> extends Component<
  Props<S, A>
> {
  static propTypes = {
    dispatch: PropTypes.func,
    theme: PropTypes.object
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  handleRollback = () => {
    this.props.dispatch(rollback());
  };

  handleSweep = () => {
    this.props.dispatch(sweep());
  };

  handleCommit = () => {
    this.props.dispatch(commit());
  };

  handleReset = () => {
    this.props.dispatch(reset());
  };

  render() {
    const { theme, hasStates, hasSkippedActions } = this.props;
    return (
      <div style={{ ...style, borderColor: theme.base02 }}>
        <LogMonitorButton theme={theme} onClick={this.handleReset} enabled>
          Reset
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleRollback}
          enabled={hasStates}
        >
          Revert
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleSweep}
          enabled={hasSkippedActions}
        >
          Sweep
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleCommit}
          enabled={hasStates}
        >
          Commit
        </LogMonitorButton>
      </div>
    );
  }
}
