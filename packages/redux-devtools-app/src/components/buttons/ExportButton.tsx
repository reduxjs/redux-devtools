import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { TiDownload } from 'react-icons/ti';
import { exportState } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class ExportButton extends Component<Props> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Button title="Export to a file" onClick={this.props.exportState}>
        <TiDownload />
      </Button>
    );
  }
}

const actionCreators = {
  exportState,
};

export default connect(null, actionCreators)(ExportButton);
