import React, { ChangeEventHandler, Component, RefCallback } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from '@redux-devtools/ui';
import { TiUpload } from 'react-icons/ti';
import { importState } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class ImportButton extends Component<Props> {
  fileInput?: HTMLInputElement | null;

  shouldComponentUpdate() {
    return false;
  }

  mapRef: RefCallback<HTMLInputElement> = (node) => {
    this.fileInput = node;
  };

  handleImport = () => {
    this.fileInput!.click();
  };

  handleImportFile: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.onload = () => {
      this.props.importState(reader.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  render() {
    return (
      <Button title="Import from a file" onClick={this.handleImport}>
        <TiUpload />
        <input
          type="file"
          ref={this.mapRef}
          style={{ display: 'none' }}
          onChange={this.handleImportFile}
        />
      </Button>
    );
  }
}

const actionCreators = {
  importState,
};

export default connect(null, actionCreators)(ImportButton);
