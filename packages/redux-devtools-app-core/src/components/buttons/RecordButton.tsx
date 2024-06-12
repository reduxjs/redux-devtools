import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { MdFiberManualRecord } from 'react-icons/md';
import { pauseRecording, CoreStoreAction } from '../../actions';
import { Dispatch } from 'redux';

type DispatchProps = ReturnType<typeof mapDispatchToProps>;
interface OwnProps {
  paused: boolean | undefined;
}
type Props = DispatchProps & OwnProps;

class RecordButton extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return nextProps.paused !== this.props.paused;
  }

  render() {
    return (
      <Button
        tooltipPosition="bottom-right"
        mark={!this.props.paused && 'base08'}
        title={this.props.paused ? 'Start recording' : 'Pause recording'}
        onClick={this.props.pauseRecording}
      >
        <MdFiberManualRecord />
      </Button>
    );
  }
}

function mapDispatchToProps(
  dispatch: Dispatch<CoreStoreAction>,
  ownProps: OwnProps,
) {
  return {
    pauseRecording: () => dispatch(pauseRecording(!ownProps.paused)),
  };
}

export default connect(null, mapDispatchToProps)(RecordButton);
