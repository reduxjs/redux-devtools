import React, { Component } from 'react';
import { ActionCreators, LiftedAction } from '@redux-devtools/core';
import { Button, Toolbar, Divider } from '@redux-devtools/ui';
import { Action } from 'redux';
import RecordButton from './buttons/RecordButton';
import PersistButton from './buttons/PersistButton';
import LockButton from './buttons/LockButton';
import InstanceSelector from './InstanceSelector';
import SyncButton from './buttons/SyncButton';
import { Options, State } from '../reducers/instances';

const { reset, rollback, commit, sweep } = ActionCreators;

interface Props {
  dispatch: (action: LiftedAction<unknown, Action<string>, unknown>) => void;
  liftedState: State;
  options: Options;
}

export default class TopButtons extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.options !== this.props.options ||
      nextProps.liftedState !== this.props.liftedState
    );
  }

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
    const options = this.props.options;
    const features = options.features;
    const { computedStates, skippedActionIds, isPaused, isLocked } =
      this.props.liftedState;
    const noStates = computedStates.length < 2;

    return (
      <Toolbar borderPosition="bottom">
        {features.pause && <RecordButton paused={isPaused} />}
        {features.persist && <PersistButton />}
        {features.lock && (
          <LockButton locked={isLocked} disabled={options.lib !== 'redux'} />
        )}
        <Divider />
        <Button
          title="Reset to the state you created the store with"
          tooltipPosition="bottom"
          onClick={this.handleReset}
        >
          Reset
        </Button>
        <Button
          title="Roll back to the last committed state"
          tooltipPosition="bottom"
          onClick={this.handleRollback}
          disabled={noStates}
        >
          Revert
        </Button>
        <Button
          title="Remove all currently disabled actions from the log"
          tooltipPosition="bottom"
          onClick={this.handleSweep}
          disabled={skippedActionIds.length === 0}
        >
          Sweep
        </Button>
        <Button
          title="Remove all actions from the log,\a and make the current state your initial state"
          tooltipPosition="bottom"
          onClick={this.handleCommit}
          disabled={noStates}
        >
          Commit
        </Button>
        <Divider />
        <InstanceSelector />
        {features.sync && <SyncButton />}
      </Toolbar>
    );
  }
}
