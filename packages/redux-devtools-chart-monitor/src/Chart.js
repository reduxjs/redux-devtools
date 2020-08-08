import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { tree } from 'd3-state-visualizer';

const wrapperStyle = {
  width: '100%',
  height: '100%',
};

class Chart extends Component {
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

  divRef = createRef();

  componentDidMount() {
    const { select, state, defaultIsVisible } = this.props;
    this.renderChart = tree(this.divRef.current, this.props);
    if (defaultIsVisible) {
      this.renderChart(select(state));
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { state, select, monitorState } = nextProps;

    if (monitorState.isVisible !== false) {
      this.renderChart(select(state));
    }
  }

  render() {
    return <div style={wrapperStyle} ref={this.divRef} />;
  }
}

export default Chart;
