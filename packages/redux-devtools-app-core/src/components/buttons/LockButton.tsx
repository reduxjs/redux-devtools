import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { IoIosLock } from 'react-icons/io';
import { lockChanges, CoreStoreAction } from '../../actions';
import { Dispatch } from 'redux';

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface OwnProps {
  locked: boolean | undefined;
  disabled: boolean;
}
type Props = DispatchProps & OwnProps;

class LockButton extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.locked !== this.props.locked;
  }

  render() {
    return (
      <Button
        tooltipPosition="bottom"
        disabled={this.props.disabled}
        mark={this.props.locked && 'base0D'}
        title={this.props.locked ? 'Unlock changes' : 'Lock changes'}
        onClick={this.props.lockChanges}
      >
        <IoIosLock />
      </Button>
    );
  }
}

function mapDispatchToProps(
  dispatch: Dispatch<CoreStoreAction>,
  ownProps: OwnProps,
) {
  return {
    lockChanges: () => dispatch(lockChanges(!ownProps.locked)),
  };
}

export default connect(null, mapDispatchToProps)(LockButton);
