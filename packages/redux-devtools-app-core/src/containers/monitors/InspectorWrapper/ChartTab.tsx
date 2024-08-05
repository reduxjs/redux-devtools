import React, { Component, RefCallback } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { withTheme } from 'styled-components';
import { tree } from 'd3-state-visualizer';
import type { HierarchyPointNode, Node, Options } from 'd3-state-visualizer';
import { getPath } from '../ChartMonitorWrapper';
import { updateMonitorState } from '../../../actions';
import { ThemeFromProvider } from '@redux-devtools/ui';

const style = {
  width: '100%',
  height: '100%',
};

type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  data: unknown;
  theme: ThemeFromProvider;
}
type Props = DispatchProps & OwnProps;

class ChartTab extends Component<Props> {
  node?: HTMLDivElement | null;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  renderChart?: (nextState?: {} | null | undefined) => void;

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    this.createChart(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.theme.scheme !== nextProps.theme.scheme ||
      nextProps.theme.light !== this.props.theme.light
    ) {
      this.node!.innerHTML = '';
      this.createChart(nextProps);
    } else if (nextProps.data !== this.props.data) {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      this.renderChart!(nextProps.data as {} | null | undefined);
    }
  }

  getRef: RefCallback<HTMLDivElement> = (node) => {
    this.node = node;
  };

  createChart(props: Props) {
    this.renderChart = tree(this.node!, this.getChartTheme(props.theme));
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    this.renderChart(props.data as {} | null | undefined);
  }

  getChartTheme(theme: ThemeFromProvider): Partial<Options> {
    return {
      heightBetweenNodesCoeff: 1,
      widthBetweenNodesCoeff: 1.3,
      tooltipOptions: {
        styles: {
          color: theme.base06,
          'background-color': theme.base01,
          opacity: '0.9',
          'border-radius': '5px',
          padding: '5px',
        },
        offset: { left: 30, top: 10 },
        indentationSize: 2,
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
      onClickText: this.onClickText,
    };
  }

  onClickText = (data: HierarchyPointNode<Node>) => {
    const inspectedStatePath: string[] = [];
    getPath(data, inspectedStatePath);
    this.props.updateMonitorState({
      inspectedStatePath,
      subTabName: data.children ? 'Chart' : 'Tree',
    });
  };

  render() {
    return <div style={style} ref={this.getRef} />;
  }
}

const actionCreators = {
  updateMonitorState,
};

const ConnectedChartTab = connect(null, actionCreators)(ChartTab);
export default withTheme(ConnectedChartTab);
