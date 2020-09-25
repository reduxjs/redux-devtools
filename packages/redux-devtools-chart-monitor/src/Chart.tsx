import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { tree } from 'd3-state-visualizer';
import { Action, Dispatch } from 'redux';
import { LiftedAction, LiftedState } from 'redux-devtools-instrument';
import * as themes from 'redux-devtools-themes';
import { Base16Theme } from 'react-base16-styling';
import { ChartMonitorState } from './reducers';
import { Primitive } from 'd3';

const wrapperStyle = {
  width: '100%',
  height: '100%',
};

export interface Props<S, A extends Action<unknown>>
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
  tooltipOptions: {
    disabled: boolean;
    offset: {
      left: number;
      top: number;
    };
    indentationSize: number;
    style: { [key: string]: Primitive } | undefined;
  };
  style: { [key: string]: Primitive } | undefined;
  defaultIsVisible?: boolean;
}

class Chart<S, A extends Action<unknown>> extends Component<Props<S, A>> {
  static propTypes = {
    state: PropTypes.object,
    rootKeyName: PropTypes.string,
    pushMethod: PropTypes.oneOf(['push', 'unshift']),
    tree: PropTypes.shape({
      name: PropTypes.string,
      children: PropTypes.array,
    }),
    id: PropTypes.string,
    style: PropTypes.shape({
      node: PropTypes.shape({
        colors: PropTypes.shape({
          default: PropTypes.string,
          parent: PropTypes.string,
          collapsed: PropTypes.string,
        }),
        radius: PropTypes.number,
      }),
      text: PropTypes.shape({
        colors: PropTypes.shape({
          default: PropTypes.string,
          hover: PropTypes.string,
        }),
      }),
      link: PropTypes.object,
    }),
    size: PropTypes.number,
    aspectRatio: PropTypes.number,
    margin: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    isSorted: PropTypes.bool,
    heightBetweenNodesCoeff: PropTypes.number,
    widthBetweenNodesCoeff: PropTypes.number,
    transitionDuration: PropTypes.number,
    onClickText: PropTypes.func,
    tooltipOptions: PropTypes.shape({
      disabled: PropTypes.bool,
      left: PropTypes.number,
      top: PropTypes.number,
      offset: PropTypes.shape({
        left: PropTypes.number,
        top: PropTypes.number,
      }),
      indentationSize: PropTypes.number,
      style: PropTypes.object,
    }),
  };

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
