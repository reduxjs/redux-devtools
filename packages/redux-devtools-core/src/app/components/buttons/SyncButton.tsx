import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from 'devui';
import { TiArrowSync } from 'react-icons/ti';
import { toggleSync } from '../../actions';
import { StoreState } from '../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class SyncButton extends Component<Props> {
  static propTypes = {
    sync: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps: Props) {
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

const mapStateToProps = (state: StoreState) => ({
  sync: state.instances.sync,
});

const actionCreators = {
  onClick: toggleSync,
};

export default connect(mapStateToProps, actionCreators)(SyncButton);
