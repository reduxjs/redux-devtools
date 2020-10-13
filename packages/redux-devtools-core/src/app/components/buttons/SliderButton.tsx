import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from 'devui';
import { MdAvTimer } from 'react-icons/md';
import { toggleSlider } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class SliderButton extends Component<Props> {
  static propTypes = {
    isOpen: PropTypes.bool,
    toggleSlider: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps: Props) {
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

const actionCreators = {
  toggleSlider,
};

export default connect(null, actionCreators)(SliderButton);
