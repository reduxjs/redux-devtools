import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'devui';
import PersistIcon from 'react-icons/lib/fa/thumb-tack';
import { togglePersist } from '../../actions';

class LockButton extends Component {
  static propTypes = {
    persisted: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired
  };

  shouldComponentUpdate(nextProps) {
    return nextProps.persisted !== this.props.persisted;
  }

  render() {
    return (
      <Button
        toolbar
        tooltipPosition="bottom"
        disabled={this.props.disabled}
        mark={this.props.persisted && 'base0D'}
        title={this.props.persisted ? 'Persist state history' : 'Disable state persisting'}
        onClick={this.props.onClick}
      >
        <PersistIcon />
      </Button>
    );
  }
}

function mapStateToProps(state) {
  return {
    persisted: state.instances.persisted
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: bindActionCreators(togglePersist, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LockButton);
