import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'devui';
import { MdFiberManualRecord } from 'react-icons/md';
import { pauseRecording } from '../../actions';

class RecordButton extends Component {
  static propTypes = {
    paused: PropTypes.bool,
    pauseRecording: PropTypes.func.isRequired,
  };

  shouldComponentUpdate(nextProps) {
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

function mapDispatchToProps(dispatch, ownProps) {
  return {
    pauseRecording: () => dispatch(pauseRecording(!ownProps.paused)),
  };
}

export default connect(null, mapDispatchToProps)(RecordButton);
