import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'devui';
import { TiArrowSync } from 'react-icons/ti';
import { toggleSync } from '../../actions';

class SyncButton extends Component {
  static propTypes = {
    sync: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.sync !== this.props.sync;
  }

  render() {
    return (
      <Button
        title="Sync actions"
        tooltipPosition="bottom-left"
        onClick={this.props.onClick}
        mark={this.props.sync && 'base0B'}
      >
        <TiArrowSync />
      </Button>
    );
  }
}

function mapStateToProps(state) {
  return {
    sync: state.instances.sync,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: bindActionCreators(toggleSync, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncButton);
