import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'devui';
import DispatchIcon from 'react-icons/lib/fa/terminal';
import { toggleDispatcher } from '../../actions';

class DispatcherButton extends Component {
  static propTypes = {
    dispatcherIsOpen: PropTypes.bool,
    toggleDispatcher: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen;
  }

  render() {
    return (
      <Button
        mark={this.props.dispatcherIsOpen && 'base0D'}
        title={this.props.dispatcherIsOpen ? 'Hide dispatcher' : 'Show dispatcher'}
        onClick={this.props.toggleDispatcher}
        tooltipPosition="top-left"
      >
        <DispatchIcon />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleDispatcher: bindActionCreators(toggleDispatcher, dispatch)
  };
}

export default connect(null, mapDispatchToProps)(DispatcherButton);
