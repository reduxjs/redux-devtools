import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Tabs } from '@redux-devtools/ui';
import { monitors } from '../utils/getMonitor';
import { selectMonitor } from '../actions';
import { CoreStoreState } from '../reducers';

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
