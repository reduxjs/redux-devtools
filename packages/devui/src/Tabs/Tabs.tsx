import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TabsHeader, { ReactButtonElement, Tab } from './TabsHeader';
import { TabsContainer } from './styles/common';

export type Position = 'left' | 'right' | 'center';

export interface TabsProps<P> {
  tabs: Tab<P>[];
  selected?: string;
  main?: boolean;
  onClick: (value: string) => void;
  collapsible?: boolean;
  position: Position;
}

export default class Tabs<P> extends Component<TabsProps<P>> {
  constructor(props: TabsProps<P>) {
    super(props);
    this.updateTabs(props);
  }

  tabsHeader?: ReactButtonElement[];
  SelectedComponent?: React.ComponentType<P>;
  selector?: () => P;

  UNSAFE_componentWillReceiveProps(nextProps: TabsProps<P>) {
    if (nextProps.selected !== this.props.selected) {
      this.updateTabs(nextProps);
    }
  }

  onMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
  };

  onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClick(e.currentTarget.value);
  };

  updateTabs(props: TabsProps<P>) {
    const tabs = props.tabs;
    const selected = props.selected;

    this.tabsHeader = tabs.map((tab, i) => {
      let isSelected;
      const value = typeof tab.value !== 'undefined' ? tab.value : tab.name;
      if (value === selected) {
        isSelected = true;
        if (tab.component) {
          this.SelectedComponent = tab.component;
          if (tab.selector) this.selector = () => tab.selector!(tab);
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
        tabs={this.tabsHeader!}
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
          <this.SelectedComponent {...(this.selector! && this.selector!())} />
        </div>
      </TabsContainer>
    );
  }

  static propTypes = {
    tabs: PropTypes.array.isRequired,
    selected: PropTypes.string,
    main: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    collapsible: PropTypes.bool,
    position: PropTypes.oneOf(['left', 'right', 'center']),
  };

  static defaultProps = { position: 'left' };
}
