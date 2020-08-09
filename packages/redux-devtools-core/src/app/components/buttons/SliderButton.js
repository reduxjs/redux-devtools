import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'devui';
import { MdAvTimer } from 'react-icons/md';
import { toggleSlider } from '../../actions';

class SliderButton extends Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    toggleSlider: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.isOpen !== this.props.isOpen;
  }

  render() {
    return (
      <Button
        mark={this.props.isOpen && 'base0D'}
        title={this.props.isOpen ? 'Hide slider' : 'Show slider'}
        tooltipPosition="top-left"
        onClick={this.props.toggleSlider}
      >
        <MdAvTimer />
      </Button>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    toggleSlider: bindActionCreators(toggleSlider, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(SliderButton);
