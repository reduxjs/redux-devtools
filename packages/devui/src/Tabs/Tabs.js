import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabsHeader from './TabsHeader';
import { TabsContainer } from './styles/common';

export default class Tabs extends Component {
  constructor(props) {
    super(props);
    this.updateTabs(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.updateTabs(nextProps);
    }
  }

  onMouseUp = e => {
    e.target.blur();
  };

  onClick = e => {
    this.props.onClick(e.target.value);
  };

  updateTabs(props) {
    const tabs = props.tabs;
    const selected = props.selected;

    this.tabsHeader = tabs.map((tab, i) => {
      let isSelected;
      const value = typeof tab.value !== 'undefined' ? tab.value : tab.name;
      if (value === selected) {
        isSelected = true;
        if (tab.component) {
          this.SelectedComponent = tab.component;
          if (tab.selector) this.selector = () => tab.selector(tab);
        }
      }
      return (
        <button
          key={i}
          value={value}
          data-selected={isSelected}
          onMouseUp={this.onMouseUp}
          onClick={this.onClick}
        >
          {tab.name}
        </button>
      );
    });
  }

  render() {
    const tabsHeader = (
      <TabsHeader
        tabs={this.tabsHeader}
        items={this.props.tabs}
        main={this.props.main}
        collapsible={this.props.collapsible}
        onClick={this.props.onClick}
        selected={this.props.selected}
        position={this.props.position}
      />
    );

    if (!this.SelectedComponent) {
      return (
        <TabsContainer position={this.props.position}>
          {tabsHeader}
        </TabsContainer>
      );
    }

    return (
      <TabsContainer position={this.props.position}>
        {tabsHeader}
        <div>
          <this.SelectedComponent {...this.selector && this.selector()} />
        </div>
      </TabsContainer>
    );
  }
}

Tabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  selected: PropTypes.string,
  main: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  collapsible: PropTypes.bool,
  position: PropTypes.oneOf(['left', 'right', 'center'])
};

Tabs.defaultProps = { position: 'left' };
