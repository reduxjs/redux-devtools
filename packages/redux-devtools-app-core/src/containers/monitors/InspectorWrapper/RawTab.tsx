import React, { Component } from 'react';
import { Editor } from '@redux-devtools/ui';
import { stringify } from 'javascript-stringify';

interface Props {
  data: unknown;
}

export default class RawTab extends Component<Props> {
  value?: string | undefined;

  constructor(props: Props) {
    super(props);
    this.stringifyData(props);
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.data !== this.value;
  }

  UNSAFE_componentWillUpdate(nextProps: Props) {
    this.stringifyData(nextProps);
  }

  stringifyData(props: Props) {
    this.value = stringify(props.data, null, 2);
  }

  render() {
    return <Editor value={this.value} />;
  }
}
