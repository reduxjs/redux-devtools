import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Tabs } from 'devui';
import StateTree from 'redux-devtools-inspector-monitor/lib/tabs/StateTab';
import ActionTree from 'redux-devtools-inspector-monitor/lib/tabs/ActionTab';
import DiffTree from 'redux-devtools-inspector-monitor/lib/tabs/DiffTab';
import { selectMonitorTab } from '../../../actions';
import RawTab from './RawTab';
import ChartTab from './ChartTab';
import VisualDiffTab from './VisualDiffTab';
import { StoreState } from '../../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class SubTabs extends Component<Props> {
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
          component: DiffTree,
          selector: () => this.props,
        },
        {
          name: 'Raw',
          component: VisualDiffTab,
          selector: this.selector,
        },
      ];
      return;
    }

    this.tabs = [
      {
        name: 'Tree',
        component: parentTab === 'Action' ? ActionTree : StateTree,
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
        tabs={this.tabs}
        selected={selected || 'Tree'}
        onClick={this.props.selectMonitorTab}
      />
    );
  }
}

SubTabs.propTypes = {
  selected: PropTypes.string,
  parentTab: PropTypes.string,
  selectMonitorTab: PropTypes.func.isRequired,
  action: PropTypes.object,
  delta: PropTypes.object,
  nextState: PropTypes.object,
};

const mapStateToProps = (state: StoreState) => ({
  parentTab: state.monitor.monitorState.tabName,
  selected: state.monitor.monitorState.subTabName,
});

const actionCreators = {
  selectMonitorTab,
};

export default connect(mapStateToProps, actionCreators)(SubTabs);
