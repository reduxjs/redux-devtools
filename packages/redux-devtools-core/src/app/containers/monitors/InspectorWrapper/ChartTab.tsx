import React, { Component, RefCallback } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { withTheme } from 'styled-components';
import { InputOptions, NodeWithId, tree } from 'd3-state-visualizer';
import { getPath } from '../ChartMonitorWrapper';
import { updateMonitorState } from '../../../actions';
import { ThemeFromProvider } from 'devui';

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
  // eslint-disable-next-line @typescript-eslint/ban-types
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
      // eslint-disable-next-line @typescript-eslint/ban-types
      this.renderChart!(nextProps.data as {} | null | undefined);
    }
  }

  getRef: RefCallback<HTMLDivElement> = (node) => {
    this.node = node;
  };

  createChart(props: Props) {
    this.renderChart = tree(this.node!, this.getChartTheme(props.theme));
    // eslint-disable-next-line @typescript-eslint/ban-types
    this.renderChart(props.data as {} | null | undefined);
  }

  getChartTheme(theme: ThemeFromProvider): Partial<InputOptions> {
    return {
      heightBetweenNodesCoeff: 1,
      widthBetweenNodesCoeff: 1.3,
      tooltipOptions: {
        style: {
          color: theme.base06,
          'background-color': theme.base01,
          opacity: '0.9',
          'border-radius': '5px',
          padding: '5px',
        },
        offset: { left: 30, top: 10 },
        indentationSize: 2,
      },
      style: {
        width: '100%',
        height: '100%',
        node: ({
          colors: {
            default: theme.base0B,
            collapsed: theme.base0B,
            parent: theme.base0E,
          },
          radius: 7,
        } as unknown) as string,
        text: ({
          colors: {
            default: theme.base0D,
            hover: theme.base06,
          },
        } as unknown) as string,
      },
      onClickText: this.onClickText,
    };
  }

  onClickText = (data: NodeWithId) => {
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
