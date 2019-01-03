import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTheme } from 'styled-components';
import { tree } from 'd3-state-visualizer';
import { getPath } from '../ChartMonitorWrapper';
import { updateMonitorState } from '../../../actions';

const style = {
  width: '100%',
  height: '100%'
};

class ChartTab extends Component {
  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.theme.scheme !== nextProps.theme.scheme ||
      nextProps.theme.light !== this.props.theme.light
    ) {
      this.node.innerHTML = '';
      this.createChart(nextProps);
    } else if (nextProps.data !== this.props.data) {
      this.renderChart(nextProps.data);
    }
  }

  getRef = node => {
    this.node = node;
  };

  createChart(props) {
    this.renderChart = tree(this.node, this.getChartTheme(props.theme));
    this.renderChart(props.data);
  }

  getChartTheme(theme) {
    return {
      heightBetweenNodesCoeff: 1,
      widthBetweenNodesCoeff: 1.3,
      tooltipOptions: {
        style: {
          color: theme.base06,
          'background-color': theme.base01,
          opacity: '0.9',
          'border-radius': '5px',
          padding: '5px'
        },
        offset: { left: 30, top: 10 },
        indentationSize: 2
      },
      style: {
        width: '100%',
        height: '100%',
        node: {
          colors: {
            default: theme.base0B,
            collapsed: theme.base0B,
            parent: theme.base0E
          },
          radius: 7
        },
        text: {
          colors: {
            default: theme.base0D,
            hover: theme.base06
          }
        }
      },
      onClickText: this.onClickText
    };
  }

  onClickText = (data) => {
    const inspectedStatePath = [];
    getPath(data, inspectedStatePath);
    this.props.updateMonitorState({
      inspectedStatePath,
      subTabName: data.children ? 'Chart' : 'Tree'
    });
  };

  render() {
    return <div style={style} ref={this.getRef} />;
  }
}

ChartTab.propTypes = {
  data: PropTypes.object,
  updateMonitorState: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    updateMonitorState: bindActionCreators(updateMonitorState, dispatch)
  };
}

const ConnectedChartTab = connect(null, mapDispatchToProps)(ChartTab);
export default withTheme(ConnectedChartTab);
