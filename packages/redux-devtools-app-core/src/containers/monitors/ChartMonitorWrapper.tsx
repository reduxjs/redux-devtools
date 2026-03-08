import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import {
  ChartMonitor,
  ChartMonitorAction,
  ChartMonitorProps,
  ChartMonitorState,
} from '@redux-devtools/chart-monitor';
import type { HierarchyPointNode, Node } from 'd3-state-visualizer';
import { selectMonitorWithState } from '../../actions/index.js';
import { Action } from 'redux';

export function getPath(
  obj: HierarchyPointNode<Node>,
  inspectedStatePath: string[],
) {
  const parent = obj.parent;
  if (!parent) return;
  getPath(parent, inspectedStatePath);
  let name = obj.data.name;
  const item = /.+\[(\d+)]/.exec(name);
  if (item) name = item[1];
  inspectedStatePath.push(name);
}

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class ChartMonitorWrapper extends Component<Props> {
  static update: <S, A extends Action<string>>(
    props: ChartMonitorProps<S, A>,
    state: ChartMonitorState | undefined,
    action: ChartMonitorAction,
  ) => ChartMonitorState = ChartMonitor.update;

  onClickText = (data: HierarchyPointNode<Node>) => {
    const inspectedStatePath: string[] = [];
    getPath(data, inspectedStatePath);
    this.props.selectMonitorWithState('InspectorMonitor', {
      inspectedStatePath,
      tabName: 'State',
      subTabName: data.children ? 'Chart' : 'Tree',
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: [],
    });
  };

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <ChartMonitor
        defaultIsVisible
        invertTheme
        onClickText={this.onClickText}
        {...this.props}
      />
    );
  }
}

const actionCreators = {
  selectMonitorWithState: selectMonitorWithState,
};

export default connect(null, actionCreators)(ChartMonitorWrapper);
