import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Tab, Tabs } from '@redux-devtools/ui';
import {
  TabComponentProps,
  StateTab,
  ActionTab,
  DiffTab,
} from '@redux-devtools/inspector-monitor';
import { Action } from 'redux';
import { selectMonitorTab } from '../../../actions';
import RawTab from './RawTab';
import ChartTab from './ChartTab';
import VisualDiffTab from './VisualDiffTab';
import { CoreStoreState } from '../../../reducers';
import type { Delta } from 'jsondiffpatch';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps &
  DispatchProps &
  TabComponentProps<unknown, Action<string>>;

class SubTabs extends Component<Props> {
  tabs?: (Tab<Props> | Tab<{ data: unknown }> | Tab<{ data?: Delta }>)[];

  constructor(props: Props) {
    super(props);
    this.updateTabs(props);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.parentTab !== this.props.parentTab) {
      this.updateTabs(nextProps);
    }
  }

  selector = () => {
    switch (this.props.parentTab) {
      case 'Action':
        return { data: this.props.action };
      case 'Diff':
        return { data: this.props.delta };
      default:
        return { data: this.props.nextState };
    }
  };

  updateTabs(props: Props) {
    const parentTab = props.parentTab;

    if (parentTab === 'Diff') {
      this.tabs = [
        {
          name: 'Tree',
          component: DiffTab,
          selector: () => this.props,
        },
        {
          name: 'Raw',
          component: VisualDiffTab,
          selector: this.selector as () => { data?: Delta },
        },
      ];
      return;
    }

    this.tabs = [
      {
        name: 'Tree',
        component: parentTab === 'Action' ? ActionTab : StateTab,
        selector: () => this.props,
      },
      {
        name: 'Chart',
        component: ChartTab,
        selector: this.selector,
      },
      {
        name: 'Raw',
        component: RawTab,
        selector: this.selector,
      },
    ];
  }

  render() {
    let selected = this.props.selected;
    if (selected === 'Chart' && this.props.parentTab === 'Diff')
      selected = 'Tree';

    return (
      <Tabs
        tabs={this.tabs! as any}
        selected={selected || 'Tree'}
        onClick={this.props.selectMonitorTab}
      />
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => ({
  parentTab: state.monitor.monitorState!.tabName,
  selected: state.monitor.monitorState!.subTabName,
});

const actionCreators = {
  selectMonitorTab,
};

export default connect(mapStateToProps, actionCreators)(SubTabs);
