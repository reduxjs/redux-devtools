import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LogMonitorEntry from './LogMonitorEntry';
import shouldPureComponentUpdate from 'react-pure-render/function';

export default class LogMonitorEntryList extends Component {
  static propTypes = {
    actionsById: PropTypes.object,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    currentStateIndex: PropTypes.number,
    consecutiveToggleStartId: PropTypes.number,

    select: PropTypes.func.isRequired,
    onActionClick: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string
    ]),
    expandActionRoot: PropTypes.bool,
    expandStateRoot: PropTypes.bool
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

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
      onActionShiftClick
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
        <LogMonitorEntry key={actionId}
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
          onActionShiftClick={onActionShiftClick} />
      );
    }

    return (
      <div>
        {elements}
      </div>
    );
  }
}
