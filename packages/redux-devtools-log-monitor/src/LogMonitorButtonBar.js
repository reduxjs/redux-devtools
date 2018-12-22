import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { ActionCreators } from 'redux-devtools';
import LogMonitorButton from './LogMonitorButton';

const { reset, rollback, commit, sweep } = ActionCreators;

const style = {
  textAlign: 'center',
  borderBottomWidth: 1,
  borderBottomStyle: 'solid',
  borderColor: 'transparent',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'row'
};

export default class LogMonitorButtonBar extends Component {
  static propTypes = {
    dispatch: PropTypes.func,
    theme: PropTypes.object
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.handleReset = this.handleReset.bind(this);
    this.handleRollback = this.handleRollback.bind(this);
    this.handleSweep = this.handleSweep.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  handleRollback() {
    this.props.dispatch(rollback());
  }

  handleSweep() {
    this.props.dispatch(sweep());
  }

  handleCommit() {
    this.props.dispatch(commit());
  }

  handleReset() {
    this.props.dispatch(reset());
  }

  render() {
    const { theme, hasStates, hasSkippedActions } = this.props;
    return (
      <div style={{...style, borderColor: theme.base02}}>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleReset}
          enabled>
          Reset
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleRollback}
          enabled={hasStates}>
          Revert
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleSweep}
          enabled={hasSkippedActions}>
          Sweep
        </LogMonitorButton>
        <LogMonitorButton
          theme={theme}
          onClick={this.handleCommit}
          enabled={hasStates}>
          Commit
        </LogMonitorButton>
      </div>
    );
  }
}
