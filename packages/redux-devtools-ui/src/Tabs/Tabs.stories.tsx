import React from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import Tabs from './';
import { tabs, simple10Tabs } from './data';
import { TabsProps } from './Tabs';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const meta: Meta = {
  title: 'Tabs',
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => (
    <Container>
      <Tabs {...args} />
    </Container>
  ),
  args: {
    tabs: simple10Tabs,
    selected: '2',
    main: true,
    collapsible: true,
    position: 'left',
  },
  argTypes: {
    tabs: { control: { disable: true } },
    onClick: { control: { disable: true } },
  },
};

export const WithContext: StoryObj<TabsProps<{ selected: string }>> = {
  render: (args) => (
    <Container>
      <Tabs {...args} />
    </Container>
  ),
  args: {
    tabs,
    selected: 'Tab2',
    main: false,
    collapsible: false,
    position: 'left',
  },
  argTypes: {
    tabs: { control: { disable: true } },
    onClick: { control: { disable: true } },
  },
};
