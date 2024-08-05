import React, { Component } from 'react';
import { Tabs } from '@redux-devtools/ui';
import Themes from './Themes';
import StateTree from './StateTree';

interface Props {
  extraTabs?: { name: string; component: React.ComponentType }[];
}

interface State {
  selected: string | undefined;
}

export default class Settings extends Component<Props, State> {
  state: State = { selected: undefined };

  handleSelect = (selected: string) => {
    this.setState({ selected });
  };

  render() {
    const { extraTabs = [] } = this.props;
    const tabs = [
      ...extraTabs,
      { name: 'Themes', component: Themes },
      { name: 'State Tree', component: StateTree },
    ];
    return (
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      <Tabs<{}>
        tabs={tabs as any}
        selected={this.state.selected || tabs[0].name}
        onClick={this.handleSelect}
      />
    );
  }
}
