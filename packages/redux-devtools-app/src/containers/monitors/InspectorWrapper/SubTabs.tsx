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
import { selectMonitorTab, setStateFilter } from '../../../actions';
import RawTab from './RawTab';
import ChartTab from './ChartTab';
import VisualDiffTab from './VisualDiffTab';
import { StoreState } from '../../../reducers';
import { Delta } from 'jsondiffpatch';
import { filter } from '../../../utils/searchUtils';
import { StateFilterValue } from '@redux-devtools/ui/lib/types/StateFilter/StateFilter';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps &
  DispatchProps &
  TabComponentProps<unknown, Action<unknown>>;

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

  filteredData = () => {
    const [data, _error] = filter(
      this.props.nextState as object,
      this.props.stateFilter
    );
    return data;
  };

  treeSelector = (): Props => {
    const props = {
      ...this.props,
    };
    if (this.props.nextState) props.nextState = this.filteredData();
    return props;
  };

  selectorCreator =
    (parentTab: Props['parentTab'], selected: Props['selected']) => () => {
      if (selected === 'Tree')
        // FIXME change to (this.props.nextState ? { nextState: data } : {})
        return this.treeSelector();
      switch (parentTab) {
        case 'Action':
          return { data: this.props.action };
        case 'Diff':
          return { data: this.props.delta };
        default:
          return { data: this.filteredData() };
      }
      // {a: 1, b: {c: 2}, e: 5, c: {d: 1}, d: 2}
    };

  updateTabs(props: Props) {
    const parentTab = props.parentTab;

    if (parentTab === 'Diff') {
      this.tabs = [
        {
          name: 'Tree',
          component: DiffTab,
          selector: this.selectorCreator(
            this.props.parentTab,
            'Tree'
          ) as () => Props,
        },
        {
          name: 'Raw',
          component: VisualDiffTab,
          selector: this.selectorCreator(this.props.parentTab, 'Raw') as () => {
            data?: Delta;
          },
        },
      ];
      return;
    }

    this.tabs = [
      {
        name: 'Tree',
        component: parentTab === 'Action' ? ActionTab : StateTab,
        selector: this.selectorCreator(
          this.props.parentTab,
          'Tree'
        ) as () => Props,
      },
      {
        name: 'Chart',
        component: ChartTab,
        selector: this.selectorCreator(this.props.parentTab, 'Chart') as () => {
          data: unknown;
        },
      },
      {
        name: 'Raw',
        component: RawTab,
        selector: this.selectorCreator(this.props.parentTab, 'Raw') as () => {
          data: Delta;
        },
      },
    ];
  }

  setFilter = (value: StateFilterValue) => {
    this.setState({
      stateFilter: {
        isJsonPath: value.isJsonPath,
        searchString: value.searchString,
      },
    });
  };

  render() {
    let selected = this.props.selected;
    if (selected === 'Chart' && this.props.parentTab === 'Diff')
      selected = 'Tree';

    return (
      <Tabs
        tabs={this.tabs! as any}
        selected={selected || 'Tree'}
        onClick={this.props.selectMonitorTab}
        setFilter={this.props.setStateFilter}
        stateFilterValue={this.props.stateFilter}
      />
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  parentTab: state.monitor.monitorState!.tabName,
  selected: state.monitor.monitorState!.subTabName,
  stateFilter: state.stateFilter,
});

const actionCreators = {
  selectMonitorTab,
  setStateFilter,
};

export default connect(mapStateToProps, actionCreators)(SubTabs);
