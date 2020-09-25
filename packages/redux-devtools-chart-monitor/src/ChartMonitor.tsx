import React, { CSSProperties, PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as themes from 'redux-devtools-themes';
import { ActionCreators, LiftedAction, LiftedState } from 'redux-devtools';
import deepmerge from 'deepmerge';
import { Action, Dispatch } from 'redux';
import { Base16Theme } from 'react-base16-styling';

import reducer, { ChartMonitorState } from './reducers';
import Chart, { Props } from './Chart';
import { Primitive } from 'd3';
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

function invertColors(theme: Base16Theme) {
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
  extends LiftedState<S, A, ChartMonitorState> {
  dispatch: Dispatch<LiftedAction<S, A, ChartMonitorState>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof themes | Base16Theme;
  invertTheme: boolean;

  state: S | null;
  isSorted: boolean;
  heightBetweenNodesCoeff: number;
  widthBetweenNodesCoeff: number;
  tooltipOptions: unknown;
  style: {
    width: number;
    height: number;
    node: {
      colors: {
        default: string;
        collapsed: string;
        parent: string;
      };
      radius: number;
    };
    text: {
      colors: {
        default: string;
        hover: string;
      };
    };
  };
  defaultIsVisible?: boolean;
}

class ChartMonitor<S, A extends Action<unknown>> extends PureComponent<
  ChartMonitorProps<S, A>
> {
  static update = reducer;

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    currentStateIndex: PropTypes.number,
    actionsById: PropTypes.object,
    stagedActionIds: PropTypes.array,
    skippedActionIds: PropTypes.array,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number,
    }),

    preserveScrollTop: PropTypes.bool,
    select: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    invertTheme: PropTypes.bool,
  };

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

  getChartStyle() {
    const theme = this.getTheme();

    return {
      width: '100%',
      height: '100%',
      node: {
        colors: {
          default: theme.base0B,
          collapsed: theme.base0B,
          parent: theme.base0E,
        },
        radius: 7,
      },
      text: {
        colors: {
          default: theme.base0D,
          hover: theme.base06,
        },
      },
    };
  }

  getChartOptions(props = this.props): Props<S, A> {
    const { computedStates } = props;
    const theme = this.getTheme();

    const tooltipOptions = {
      disabled: false,
      offset: { left: 30, top: 10 },
      indentationSize: 2,
      style: {
        'background-color': theme.base06,
        opacity: '0.7',
        'border-radius': '5px',
        padding: '5px',
      },
    };

    const defaultOptions = {
      state: computedStates.length
        ? computedStates[props.currentStateIndex].state
        : null,
      isSorted: false,
      heightBetweenNodesCoeff: 1,
      widthBetweenNodesCoeff: 1.3,
      tooltipOptions,
      style: (this.getChartStyle() as unknown) as
        | { [key: string]: Primitive }
        | undefined,
    };

    return deepmerge(defaultOptions, props);
  }

  render() {
    const theme = this.getTheme();

    const ChartAsAny = Chart as any;
    return (
      <div style={{ ...styles.container, backgroundColor: theme.base07 }}>
        <ChartAsAny {...this.getChartOptions()} />
      </div>
    );
  }
}

export default ChartMonitor;
