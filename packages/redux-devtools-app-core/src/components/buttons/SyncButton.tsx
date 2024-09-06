import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { TiArrowSync } from 'react-icons/ti';
import { toggleSync } from '../../actions';
import { CoreStoreState } from '../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = StateProps & DispatchProps;

class SyncButton extends Component<Props> {
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

const mapStateToProps = (state: CoreStoreState) => ({
  sync: state.instances.sync,
});

const actionCreators = {
  onClick: toggleSync,
};

export default connect(mapStateToProps, actionCreators)(SyncButton);
