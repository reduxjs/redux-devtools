import React, { Component, ComponentType } from 'react';
import Editor from '../';
import Tabs from '../../Tabs';

const value1 = `
  const func1 = () => {}
`;

const value2 = `
  const func2 = () => {}
`;

interface Props {
  lineNumbers: boolean;
}

interface TabProps {
  value: string;
  lineNumbers: boolean;
}

/* eslint-disable react/prop-types */
export default class WithTabs extends Component<Props> {
  state = {
    selected: 'Function 1'
  };

  render() {
    const { lineNumbers } = this.props;
    return (
      <Tabs<TabProps>
        tabs={[
          {
            name: 'Function 1',
            component: (Editor as unknown) as ComponentType<TabProps>,
            selector: () => ({ value: value1, lineNumbers })
          },
          {
            name: 'Function 2',
            component: (Editor as unknown) as ComponentType<TabProps>,
            selector: () => ({ value: value2, lineNumbers })
          }
        ]}
        selected={this.state.selected}
        onClick={selected => {
          this.setState({ selected });
        }}
      />
    );
  }
}
