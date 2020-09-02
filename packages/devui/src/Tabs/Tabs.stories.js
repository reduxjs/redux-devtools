import React from 'react';
import styled from 'styled-components';
import Tabs from './';
import { tabs, simple10Tabs } from './data';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export default {
  title: 'Tabs',
  component: Tabs,
};

const Template = (args) => (
  <Container>
    <Tabs {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  tabs: simple10Tabs,
  selected: '2',
  main: true,
  collapsible: true,
  position: 'left',
};
Default.argTypes = {
  tabs: { control: { disable: true } },
  onClick: { control: { disable: true } },
};

export const WithContent = Template.bind({});
WithContent.args = {
  tabs,
  selected: 'Tab2',
  main: false,
  collapsible: false,
  position: 'left',
};
WithContent.argTypes = {
  tabs: { control: { disable: true } },
  onClick: { control: { disable: true } },
};
