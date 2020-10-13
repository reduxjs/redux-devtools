import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from 'devui';
import { FaThumbtack } from 'react-icons/fa';
import { togglePersist } from '../../actions';
import { StoreState } from '../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class LockButton extends Component<Props> {
  static propTypes = {
    persisted: PropTypes.bool,
    disabled: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.persisted !== this.props.persisted;
  }

  render() {
    return (
      <Button
        toolbar
        tooltipPosition="bottom"
        disabled={this.props.disabled}
        mark={this.props.persisted && 'base0D'}
        title={
          this.props.persisted
            ? 'Persist state history'
            : 'Disable state persisting'
        }
        onClick={this.props.onClick}
      >
        <FaThumbtack />
      </Button>
    );
  }
}

const mapStateToProps = (state: StoreState) => ({
  persisted: state.instances.persisted,
});

const actionCreators = {
  onClick: togglePersist,
};

export default connect(mapStateToProps, actionCreators)(LockButton);
