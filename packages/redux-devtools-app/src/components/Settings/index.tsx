import React, { Component } from 'react';
import { Tabs } from 'devui';
import Connection from './Connection';
import Themes from './Themes';

interface State {
  selected: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
class Settings extends Component<{}, State> {
  tabs = [
    { name: 'Connection', component: Connection },
    { name: 'Themes', component: Themes },
  ];
  state: State = { selected: 'Connection' };

  handleSelect = (selected: string) => {
    this.setState({ selected });
  };

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-types
      <Tabs<{}>
        tabs={this.tabs as any}
        selected={this.state.selected}
        onClick={this.handleSelect}
      />
    );
  }
}

export default Settings;
