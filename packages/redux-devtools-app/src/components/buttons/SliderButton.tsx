import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { MdAvTimer } from 'react-icons/md';
import { toggleSlider } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  isOpen: boolean;
}
type Props = DispatchProps & OwnProps;

class SliderButton extends Component<Props> {
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
