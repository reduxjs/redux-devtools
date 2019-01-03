import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs } from 'devui';
import { monitors } from '../utils/getMonitor';
import { selectMonitor } from '../actions';

class MonitorSelector extends Component {
  static propTypes = {
    selected: PropTypes.string,
    selectMonitor: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
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

function mapStateToProps(state) {
  return {
    selected: state.monitor.selected
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectMonitor: bindActionCreators(selectMonitor, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MonitorSelector);
