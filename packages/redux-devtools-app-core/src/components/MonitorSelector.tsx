import React, { Component } from 'react';
import type { ResolveThunks } from 'react-redux';
import { connect } from 'react-redux';
import { Tabs } from '@redux-devtools/ui';
import { monitors } from '../utils/getMonitor.js';
import { selectMonitor } from '../actions/index.js';
import type { CoreStoreState } from '../reducers/index.js';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class MonitorSelector extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.selected !== this.props.selected;
  }

  render() {
    return (
      <Tabs
        main
        collapsible
        position="center"
        tabs={monitors}
        onClick={this.props.selectMonitor}
        selected={this.props.selected || 'InspectorMonitor'}
      />
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => ({
  selected: state.monitor.selected,
});

const actionCreators = {
  selectMonitor,
};

export default connect(mapStateToProps, actionCreators)(MonitorSelector);
