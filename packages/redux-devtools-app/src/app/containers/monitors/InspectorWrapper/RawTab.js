import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'devui';
import stringify from 'javascript-stringify';

export default class RawTab extends Component {
  constructor(props) {
    super(props);
    this.stringifyData(props);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.data !== this.value;
  }

  componentWillUpdate(nextProps) {
    this.stringifyData(nextProps);
  }

  stringifyData(props) {
    this.value = stringify(props.data, null, 2);
  }

  render() {
    return (
      <Editor value={this.value} />
    );
  }
}
