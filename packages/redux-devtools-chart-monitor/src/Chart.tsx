import React, { Component, createRef } from 'react';
import { tree } from 'd3-state-visualizer';
import type { Options } from 'd3-state-visualizer';
import { base16Themes } from 'react-base16-styling';
import type { Base16Theme } from 'react-base16-styling';
import { Action, Dispatch } from 'redux';
import { LiftedAction, LiftedState } from '@redux-devtools/core';
import { ChartMonitorState } from './reducers';

const wrapperStyle = {
  width: '100%',
  height: '100%',
};

export interface Props<S, A extends Action<string>>
  extends LiftedState<S, A, ChartMonitorState>,
    Options {
  dispatch: Dispatch<LiftedAction<S, A, ChartMonitorState>>;
  preserveScrollTop: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  invertTheme: boolean;

  state: S | null;
  defaultIsVisible?: boolean;
}

class Chart<S, A extends Action<string>> extends Component<Props<S, A>> {
  divRef = createRef<HTMLDivElement>();
  // eslint-disable-next-line @typescript-eslint/ban-types
  renderChart?: (state?: {} | null | undefined) => void;

  componentDidMount() {
    const { select, state, defaultIsVisible } = this.props;
    this.renderChart = tree(this.divRef.current!, this.props);
    if (defaultIsVisible) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      this.renderChart(select(state!) as {} | null | undefined);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props<S, A>) {
    const { state, select, monitorState } = nextProps;

    if (monitorState.isVisible !== false) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      this.renderChart!(select(state!) as {} | null | undefined);
    }
  }

  render() {
    return <div style={wrapperStyle} ref={this.divRef} />;
  }
}

export default Chart;
