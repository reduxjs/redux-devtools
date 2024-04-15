import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { FaThumbtack } from 'react-icons/fa';
import { togglePersist } from '../../actions';
import { CoreStoreState } from '../../reducers';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ResolveThunks<typeof actionCreators>;
interface OwnProps {
  disabled?: boolean;
}
type Props = StateProps & DispatchProps & OwnProps;

class LockButton extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.persisted !== this.props.persisted;
  }

  render() {
    return (
      <Button
        tooltipPosition="bottom"
        disabled={this.props.disabled}
        mark={this.props.persisted && 'base0D'}
        title={
          this.props.persisted
            ? 'Disable state persisting'
            : 'Persist state history'
        }
        onClick={this.props.onClick}
      >
        <FaThumbtack />
      </Button>
    );
  }
}

const mapStateToProps = (state: CoreStoreState) => ({
  persisted: state.instances.persisted,
});

const actionCreators = {
  onClick: togglePersist,
};

export default connect(mapStateToProps, actionCreators)(LockButton);
