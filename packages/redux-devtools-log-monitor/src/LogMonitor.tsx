import React, { PureComponent } from 'react';
import { Action, Dispatch } from 'redux';
import { base16Themes } from 'react-base16-styling';
import type { Base16Theme } from 'react-base16-styling';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import debounce from 'lodash.debounce';
import {
  updateScrollTop,
  startConsecutiveToggle,
  LogMonitorAction,
} from './actions';
import reducer, { LogMonitorState } from './reducers';
import LogMonitorButtonBar from './LogMonitorButtonBar';
import LogMonitorEntryList from './LogMonitorEntryList';

const { toggleAction, setActionsActive } = ActionCreators;

const styles: {
  container: React.CSSProperties;
  elements: React.CSSProperties;
} = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
    direction: 'ltr',
  },
  elements: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
};

interface ExternalProps<S, A extends Action<string>> {
  dispatch: Dispatch<LogMonitorAction | LiftedAction<S, A, LogMonitorState>>;

  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  hideMainButtons?: boolean;
}

interface DefaultProps<S> {
  select: (state: unknown) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  preserveScrollTop: boolean;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
}

export interface LogMonitorProps<S, A extends Action<string>>
  extends LiftedState<S, A, LogMonitorState> {
  dispatch: Dispatch<LogMonitorAction | LiftedAction<S, A, LogMonitorState>>;

  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  hideMainButtons?: boolean;
}

class LogMonitor<S, A extends Action<string>> extends PureComponent<
  LogMonitorProps<S, A>
> {
  static update = reducer;

  static defaultProps: DefaultProps<unknown> = {
    select: (state: unknown) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    expandActionRoot: true,
    expandStateRoot: true,
    markStateDiff: false,
  };

  scrollDown?: boolean;
  node?: HTMLDivElement | null;

  updateScrollTop = debounce(() => {
    const node = this.node;
    this.props.dispatch(updateScrollTop(node ? node.scrollTop : 0));
  }, 500);

  scroll() {
    const node = this.node;
    if (!node) {
      return;
    }
    if (this.scrollDown) {
      const { offsetHeight, scrollHeight } = node;
      node.scrollTop = scrollHeight - offsetHeight;
      this.scrollDown = false;
    }
  }

  componentDidMount() {
    const node = this.node;
    if (!node || !this.props.monitorState) {
      return;
    }

    if (this.props.preserveScrollTop) {
      node.scrollTop = this.props.monitorState.initialScrollTop;
      node.addEventListener('scroll', this.updateScrollTop);
    } else {
      this.scrollDown = true;
      this.scroll();
    }
  }

  componentWillUnmount() {
    const node = this.node;
    if (node && this.props.preserveScrollTop) {
      node.removeEventListener('scroll', this.updateScrollTop);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: LogMonitorProps<S, A>) {
    const node = this.node;
    if (!node) {
      this.scrollDown = true;
    } else if (
      this.props.stagedActionIds.length < nextProps.stagedActionIds.length
    ) {
      const { scrollTop, offsetHeight, scrollHeight } = node;

      this.scrollDown =
        Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 20;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidUpdate() {
    this.scroll();
  }

  handleToggleAction = (id: number) => {
    this.props.dispatch(toggleAction(id));
  };

  handleToggleConsecutiveAction = (id: number) => {
    const { monitorState, actionsById } = this.props;
    const { consecutiveToggleStartId } = monitorState;
    if (consecutiveToggleStartId && actionsById[consecutiveToggleStartId]) {
      const { skippedActionIds } = this.props;
      const start = Math.min(consecutiveToggleStartId, id);
      const end = Math.max(consecutiveToggleStartId, id);
      const active = skippedActionIds.indexOf(consecutiveToggleStartId) > -1;
      this.props.dispatch(setActionsActive(start, end + 1, active));
      this.props.dispatch(startConsecutiveToggle(null));
    } else if (id > 0) {
      this.props.dispatch(startConsecutiveToggle(id));
    }
  };

  getTheme() {
    const { theme } = this.props;
    if (typeof theme !== 'string') {
      return theme;
    }

    if (typeof base16Themes[theme] !== 'undefined') {
      return base16Themes[theme];
    }

    // eslint-disable-next-line no-console
    console.warn(
      'DevTools theme ' + theme + ' not found, defaulting to nicinabox',
    );
    return base16Themes.nicinabox;
  }

  getRef: React.RefCallback<HTMLDivElement> = (node) => {
    this.node = node;
  };

  render() {
    const theme = this.getTheme();
    const { consecutiveToggleStartId } = this.props.monitorState;

    const {
      dispatch,
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff,
    } = this.props;

    const entryListProps = {
      theme,
      actionsById,
      skippedActionIds,
      stagedActionIds,
      computedStates,
      currentStateIndex,
      consecutiveToggleStartId,
      select,
      expandActionRoot,
      expandStateRoot,
      markStateDiff,
      onActionClick: this.handleToggleAction,
      onActionShiftClick: this.handleToggleConsecutiveAction,
    };

    return (
      <div style={{ ...styles.container, backgroundColor: theme.base00 }}>
        {!this.props.hideMainButtons && (
          <LogMonitorButtonBar
            theme={theme}
            dispatch={dispatch}
            hasStates={computedStates.length > 1}
            hasSkippedActions={skippedActionIds.length > 0}
          />
        )}
        <div
          style={
            this.props.hideMainButtons
              ? styles.elements
              : { ...styles.elements, top: 30 }
          }
          ref={this.getRef}
        >
          <LogMonitorEntryList {...entryListProps} />
        </div>
      </div>
    );
  }
}

export default LogMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    state: LogMonitorState | undefined,
    action: LogMonitorAction,
  ): LogMonitorState;
  defaultProps: DefaultProps<unknown>;
};
