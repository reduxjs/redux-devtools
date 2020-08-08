import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shouldPureComponentUpdate from 'react-pure-render/function';
import * as themes from 'redux-devtools-themes';
import { ActionCreators } from 'redux-devtools';
import deepmerge from 'deepmerge';

import reducer from './reducers';
import Chart from './Chart';
const { reset, rollback, commit, sweep, toggleAction } = ActionCreators;

const styles = {
  container: {
    fontFamily: 'monaco, Consolas, Lucida Console, monospace',
    position: 'relative',
    overflowY: 'hidden',
    width: '100%',
    height: '100%',
    minWidth: 300,
  },
};

function invertColors(theme) {
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

class ChartMonitor extends Component {
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
    select: (state) => state,
    theme: 'nicinabox',
    preserveScrollTop: true,
    invertTheme: false,
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  constructor(props) {
    super(props);
    this.handleToggleAction = this.handleToggleAction.bind(this);
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

  handleToggleAction(id) {
    this.props.dispatch(toggleAction(id));
  }

  handleReset() {
    this.props.dispatch(reset());
  }

  getTheme() {
    let { theme, invertTheme } = this.props;
    if (typeof theme !== 'string') {
      return invertTheme ? invertColors(theme) : theme;
    }

    if (typeof themes[theme] !== 'undefined') {
      return invertTheme ? invertColors(themes[theme]) : themes[theme];
    }

    // eslint-disable-next-line no-console
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

  getChartOptions(props = this.props) {
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
      style: this.getChartStyle(),
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
