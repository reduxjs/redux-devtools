import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { FaTerminal } from 'react-icons/fa';
import { toggleDispatcher } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  dispatcherIsOpen: boolean;
}
type Props = DispatchProps & OwnProps;

class DispatcherButton extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.dispatcherIsOpen !== this.props.dispatcherIsOpen;
  }

  render() {
    return (
      <Button
        mark={this.props.dispatcherIsOpen && 'base0D'}
        title={
          this.props.dispatcherIsOpen ? 'Hide dispatcher' : 'Show dispatcher'
        }
        onClick={this.props.toggleDispatcher}
        tooltipPosition="top-left"
      >
        <FaTerminal />
      </Button>
    );
  }
}

const actionCreators = {
  toggleDispatcher,
};

export default connect(null, actionCreators)(DispatcherButton);
