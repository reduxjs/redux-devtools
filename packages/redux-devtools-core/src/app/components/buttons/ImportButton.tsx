import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import { Button } from 'devui';
import { TiUpload } from 'react-icons/ti';
import { importState } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class ImportButton extends Component<Props> {
  static propTypes = {
    importState: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.handleImport = this.handleImport.bind(this);
    this.handleImportFile = this.handleImportFile.bind(this);
    this.mapRef = this.mapRef.bind(this);
  }

  shouldComponentUpdate() {
    return false;
  }

  mapRef(node) {
    this.fileInput = node;
  }

  handleImport() {
    this.fileInput.click();
  }

  handleImportFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.props.importState(reader.result);
    };
    reader.readAsText(file);
    e.target.value = ''; // eslint-disable-line no-param-reassign
  }

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
