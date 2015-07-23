import React, { PropTypes, findDOMNode } from 'react';
import LogMonitorEntry from './LogMonitorEntry';

export default class LogMonitor {
  constructor() {
    window.addEventListener('keydown', ::this.handleKeyPress);
  }

  static propTypes = {
    computedStates: PropTypes.array.isRequired,
    currentStateIndex: PropTypes.number.isRequired,
    monitorState: PropTypes.object.isRequired,
    stagedActions: PropTypes.array.isRequired,
    skippedActions: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    rollback: PropTypes.func.isRequired,
    sweep: PropTypes.func.isRequired,
    toggleAction: PropTypes.func.isRequired,
    jumpToState: PropTypes.func.isRequired,
    setMonitorState: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state,
    monitorState: { isVisible: true }
  };

  componentWillReceiveProps(nextProps) {
    const node = findDOMNode(this);
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActions.length < nextProps.stagedActions.length
    ) {
      const scrollableNode = node.parentElement;
      const { scrollTop, offsetHeight, scrollHeight } = scrollableNode;

      this.scrollDown = Math.abs(
        scrollHeight - (scrollTop + offsetHeight)
      ) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    const node = findDOMNode(this);
    if (!node) {
      return;
    }

    if (this.scrollDown) {
      const scrollableNode = node.parentElement;
      const { offsetHeight, scrollHeight } = scrollableNode;

      scrollableNode.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  handleRollback() {
    this.props.rollback();
  }

  handleSweep() {
    this.props.sweep();
  }

  handleCommit() {
    this.props.commit();
  }

  handleToggleAction(index) {
    this.props.toggleAction(index);
  }

  handleReset() {
    this.props.reset();
  }

  handleKeyPress(event) {
    const { monitorState } = this.props;

    if (event.ctrlKey && event.keyCode === 72) { // Ctrl+H
      event.preventDefault();
      this.props.setMonitorState({
        ...monitorState,
        isVisible: !monitorState.isVisible
      });
    }
  }

  render() {
    const elements = [];
    const { monitorState, skippedActions, stagedActions, computedStates, select } = this.props;

    if (!monitorState.isVisible) {
      return null;
    }

    for (let i = 0; i < stagedActions.length; i++) {
      const action = stagedActions[i];
      const { state, error } = computedStates[i];

      elements.push(
        <LogMonitorEntry key={i}
                         index={i}
                         select={select}
                         action={action}
                         state={state}
                         collapsed={skippedActions[i]}
                         error={error}
                         onActionClick={::this.handleToggleAction} />
      );
    }

    return (
      <div style={{
        fontFamily: 'monospace',
        position: 'relative',
        padding: '1rem'
      }}>
        <div>
          <div style={{
            paddingBottom: '.5rem'
          }}>
            <small>Press Ctrl+H to hide.</small>
          </div>
          <div>
            <a onClick={::this.handleReset}
               style={{ textDecoration: 'underline', cursor: 'hand' }}>
              <small>Reset</small>
            </a>
          </div>
        </div>
        {elements}
        <div>
          {computedStates.length > 1 &&
            <a onClick={::this.handleRollback}
               style={{ textDecoration: 'underline', cursor: 'pointer' }}>
              Rollback
            </a>
          }
          {Object.keys(skippedActions).some(key => skippedActions[key]) &&
            <span>
              {' • '}
              <a onClick={::this.handleSweep}
                 style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Sweep
              </a>
            </span>
          }
          {computedStates.length > 1 &&
            <span>
              <span>
              {' • '}
              </span>
              <a onClick={::this.handleCommit}
                 style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                Commit
              </a>
            </span>
          }
        </div>
      </div>
    );
  }
}
