import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'devui';
import Connection from './Connection';
import Themes from './Themes';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.tabs = [
      { name: 'Connection', component: Connection },
      { name: 'Themes', component: Themes }
    ];
    this.state = { selected: 'Connection' };
  }

  handleSelect = selected => {
    this.setState({ selected });
  };

  render() {
    return (
      <Tabs
        toRight
        tabs={this.tabs}
        selected={this.state.selected}
        onClick={this.handleSelect}
      />
    );
  }
}

export default Settings;
