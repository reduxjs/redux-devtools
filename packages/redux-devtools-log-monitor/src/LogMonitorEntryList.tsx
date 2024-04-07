import React, { PureComponent } from 'react';
import { Action } from 'redux';
import { PerformAction } from '@redux-devtools/core';
import type { Base16Theme } from 'react-base16-styling';
import LogMonitorEntry from './LogMonitorEntry';

interface Props<S, A extends Action<string>> {
  actionsById: { [actionId: number]: PerformAction<A> };
  computedStates: { state: S; error?: string }[];
  stagedActionIds: number[];
  skippedActionIds: number[];
  currentStateIndex: number;
  consecutiveToggleStartId: number | null | undefined;

  select: (state: S) => unknown;
  onActionClick: (id: number) => void;
  theme: Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  onActionShiftClick: (id: number) => void;
}

export default class LogMonitorEntryList<
  S,
  A extends Action<string>,
> extends PureComponent<Props<S, A>> {
  render() {
    const elements = [];
    const {
      theme,
      actionsById,
      computedStates,
      currentStateIndex,
      consecutiveToggleStartId,
      select,
      skippedActionIds,
      stagedActionIds,
      expandActionRoot,
      expandStateRoot,
      markStateDiff,
      onActionClick,
      onActionShiftClick,
    } = this.props;

    for (let i = 0; i < stagedActionIds.length; i++) {
      const actionId = stagedActionIds[i];
      const action = actionsById[actionId].action;
      const { state, error } = computedStates[i];
      let previousState;
      if (i > 0) {
        previousState = computedStates[i - 1].state;
      }
      elements.push(
        <LogMonitorEntry
          key={actionId}
          theme={theme}
          select={select}
          action={action}
          actionId={actionId}
          state={state}
          previousState={previousState}
          collapsed={skippedActionIds.indexOf(actionId) > -1}
          inFuture={i > currentStateIndex}
          selected={consecutiveToggleStartId === i}
          error={error}
          expandActionRoot={expandActionRoot}
          expandStateRoot={expandStateRoot}
          markStateDiff={markStateDiff}
          onActionClick={onActionClick}
          onActionShiftClick={onActionShiftClick}
        />,
      );
    }

    return <div>{elements}</div>;
  }
}
