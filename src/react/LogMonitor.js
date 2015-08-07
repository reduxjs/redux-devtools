import React, { PropTypes, findDOMNode } from 'react';
import LogMonitorEntry from './LogMonitorEntry';
import LogMonitorButton from './LogMonitorButton';
import * as themes from "./themes";

const styles = {
  container: {
    fontFamily: 'monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%'
  },
  buttonBarWrapper: {
    marginBottom: 1
  },
  buttonBar: {
    paddingLeft: 2
  }
}

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
    monitorState: { isVisible: true },
    theme: 'ocean'
  };

  componentWillReceiveProps(nextProps) {
    const node = findDOMNode(this.refs.elements);
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
    const node = findDOMNode(this.refs.elements);
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
    let theme;
    if (typeof this.props.theme === 'string') {
      if (typeof themes[this.props.theme] !== 'undefined') {
        theme = themes[this.props.theme]
      } else {
        console.warn('DevTools theme ' + this.props.theme + ' not found, defaulting to ocean');
        theme = themes.ocean
      }
    } else {
      theme = this.props.theme;
    }
    if (!monitorState.isVisible) {
      return null;
    }

    for (let i = 0; i < stagedActions.length; i++) {
      const action = stagedActions[i];
      const { state, error } = computedStates[i];

      elements.push(
        <LogMonitorEntry key={i}
                         index={i}
                         theme={theme}
                         select={select}
                         action={action}
                         state={state}
                         collapsed={skippedActions[i]}
                         error={error}
                         onActionClick={::this.handleToggleAction} />
      );
    }

    return (
      <div style={{...styles.container, backgroundColor: theme.base00}}>
        <div style={{
          ...styles.buttonBar,
          backgroundColor: theme.base01,
          borderBottom: theme.base00
        }}>
          <LogMonitorButton theme={theme} onClick={::this.handleReset}>Reset</LogMonitorButton>
          {computedStates.length > 1 &&
            <LogMonitorButton theme={theme} onClick={::this.handleRollback}>Revert</LogMonitorButton>
          }
          {Object.keys(skippedActions).some(key => skippedActions[key]) &&
            <LogMonitorButton theme={theme} onClick={::this.handleSweep}>Sweep</LogMonitorButton>
          }
          {computedStates.length > 1 &&
            <LogMonitorButton theme={theme} onClick={::this.handleCommit}>Commit</LogMonitorButton>
          }
        </div>
        <div styles={{
          overflowX: 'hidden',
          overflowY: 'auto'
        }} ref="elements">
          {elements}
        </div>
      </div>
    );
  }
}
