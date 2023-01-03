import React, { CSSProperties, PureComponent } from 'react';
import * as themes from 'redux-devtools-themes';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import deepmerge from 'deepmerge';
import { Action, Dispatch } from 'redux';
import type { Options } from 'd3-state-visualizer';

import reducer, { ChartMonitorState } from './reducers';
import Chart, { Props } from './Chart';
// eslint-disable-next-line @typescript-eslint/unbound-method
const { reset, rollback, commit, sweep, toggleAction } = ActionCreators;

const styles: { container: CSSProperties } = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
  },
};

function invertColors(theme: themes.Base16Theme) {
  return {
    ...theme,
    base00: theme.base07,
    base01: theme.base06,
    base02: theme.base05,
    base03: theme.base04,
    base04: theme.base03,
    base05: theme.base02,
    base06: theme.base01,
    base07: theme.base00,
  };
}

export interface ChartMonitorProps<S, A extends Action<unknown>>
  extends LiftedState<S, A, ChartMonitorState>,
    Options {
  dispatch: Dispatch<LiftedAction<S, A, ChartMonitorState>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | themes.Base16Theme;
  invertTheme: boolean;

  defaultIsVisible?: boolean;
}

class ChartMonitor<S, A extends Action<unknown>> extends PureComponent<
  ChartMonitorProps<S, A>
> {
  static update = reducer;

  static defaultProps = {
    select: (state: unknown) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    invertTheme: false,
  };

  handleRollback = () => {
    this.props.dispatch(rollback());
  };

  handleSweep = () => {
    this.props.dispatch(sweep());
  };

  handleCommit = () => {
    this.props.dispatch(commit());
  };

  handleToggleAction = (id: number) => {
    this.props.dispatch(toggleAction(id));
  };

  handleReset = () => {
    this.props.dispatch(reset());
  };

  getTheme() {
    const { theme, invertTheme } = this.props;
    if (typeof theme !== 'string') {
      return invertTheme ? invertColors(theme) : theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return invertTheme ? invertColors(themes[theme]) : themes[theme];
    }

    console.warn(
      'DevTools theme ' + theme + ' not found, defaulting to nicinabox'
    );
    return invertTheme ? invertColors(themes.nicinabox) : themes.nicinabox;
  }

  getChartOptions(props = this.props): Props<S, A> {
    const { computedStates } = props;
    const theme = this.getTheme();

    const defaultOptions = {
      state: computedStates.length
        ? computedStates[props.currentStateIndex].state
        : null,
      isSorted: false,
      heightBetweenNodesCoeff: 1,
      widthBetweenNodesCoeff: 1.3,
      tooltipOptions: {
        disabled: false,
        offset: { left: 30, top: 10 },
        indentationSize: 2,
        styles: {
          'background-color': theme.base06,
          opacity: '0.7',
          'border-radius': '5px',
          padding: '5px',
        },
      },
      chartStyles: {
        width: '100%',
        height: '100%',
      },
      nodeStyleOptions: {
        colors: {
          default: theme.base0B,
          collapsed: theme.base0B,
          parent: theme.base0E,
        },
        radius: 7,
      },
      textStyleOptions: {
        colors: {
          default: theme.base0D,
          hover: theme.base06,
        },
      },
    };

    return deepmerge(defaultOptions, props);
  }

  render() {
    const theme = this.getTheme();

    return (
      <div style={{ ...styles.container, backgroundColor: theme.base07 }}>
        <Chart {...this.getChartOptions()} />
      </div>
    );
  }
}

export default ChartMonitor;
