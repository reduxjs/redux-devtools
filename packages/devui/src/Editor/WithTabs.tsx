import React, { Component } from 'react';
import Editor from './';
import Tabs from '../Tabs';

const value1 = `
  const func1 = () => {}
`;

const value2 = `
  const func2 = () => {}
`;

/* eslint-disable react/prop-types */
export default class WithTabs extends Component {
  state = {
    selected: 'Function 1',
  };

  render() {
    const { align, lineNumbers } = this.props;
    return (
      <Tabs
        tabs={[
          {
            name: 'Function 1',
            component: Editor,
            selector: () => ({ value: value1, lineNumbers }),
          },
          {
            name: 'Function 2',
            component: Editor,
            selector: () => ({ value: value2, lineNumbers }),
          },
        ]}
        selected={this.state.selected}
        onClick={(selected) => {
          this.setState({ selected });
        }}
        align={align}
      />
    );
  }
}
