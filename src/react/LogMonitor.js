import React, { PropTypes, findDOMNode } from 'react';
import LogMonitorEntry from './LogMonitorEntry';

export default class LogMonitor {
  constructor() {
    window.addEventListener('keypress', ::this.handleKeyPress);
  }

  static propTypes = {
    computedStates: PropTypes.array.isRequired,
    currentStateIndex: PropTypes.number.isRequired,
    monitorState: PropTypes.object.isRequired,
    stagedActions: PropTypes.array.isRequired,
    skippedActions: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    show: PropTypes.func.isRequired,
    commit: PropTypes.func.isRequired,
    rollback: PropTypes.func.isRequired,
    sweep: PropTypes.func.isRequired,
    toggleAction: PropTypes.func.isRequired,
    jumpToState: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired
  };

  static defaultProps = {
    select: (state) => state
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.stagedActions.length < nextProps.stagedActions.length) {
      const scrollableNode = findDOMNode(this).parentElement;
      const { scrollTop, offsetHeight, scrollHeight } = scrollableNode;

      this.scrollDown = Math.abs(
        scrollHeight - (scrollTop + offsetHeight)
      ) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.stagedActions.length < this.props.stagedActions.length &&
      this.scrollDown
    ) {
      const scrollableNode = findDOMNode(this).parentElement;
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
    let { isVisible } = this.props.monitorState;

    if (event.ctrlKey && event.keyCode === 8) {
      if (isVisible) {
        this.props.hide();
      } else {
        this.props.show();
      }
    }
  }

  render() {
    const elements = [];
    const { skippedActions, stagedActions, computedStates, select } = this.props;

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

    if (this.props.monitorState.isVisible === true) {
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
              <small>Press `ctl+h` to hide.</small>
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
                 style={{ textDecoration: 'underline', cursor: 'hand' }}>
                Rollback
              </a>
            }
            {Object.keys(skippedActions).some(key => skippedActions[key]) &&
              <span>
                {' • '}
                <a onClick={::this.handleSweep}
                   style={{ textDecoration: 'underline', cursor: 'hand' }}>
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
                   style={{ textDecoration: 'underline', cursor: 'hand' }}>
                  Commit
                </a>
              </span>
            }
          </div>
        </div>
      );
    }

    return false;
  }
}
