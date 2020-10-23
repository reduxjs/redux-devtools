import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'devui';
import { IoIosLock } from 'react-icons/io';
import { lockChanges, StoreAction } from '../../actions';
import { Dispatch } from 'redux';

class LockButton extends Component {
  static propTypes = {
    locked: PropTypes.bool,
    disabled: PropTypes.bool,
    lockChanges: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
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
  dispatch: Dispatch<StoreAction>,
  ownProps: OwnProps
) {
  return {
    lockChanges: () => dispatch(lockChanges(!ownProps.locked)),
  };
}

export default connect(null, mapDispatchToProps)(LockButton);
