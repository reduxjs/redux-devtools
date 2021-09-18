import React from 'react';
import styled from 'styled-components';
import { Story } from '@storybook/react';
import ContextMenu from './';
import { items } from './data';
import { ContextMenuProps } from './ContextMenu';

export default {
  title: 'ContextMenu',
  component: ContextMenu,
};

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const Template: Story<ContextMenuProps> = (args) => (
  <Container>
    <ContextMenu {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  visible: true,
  x: 100,
  y: 100,
  items,
};
Default.argTypes = {
  visible: { control: { disable: true } },
  items: { control: { disable: true } },
  onClick: { control: { disable: true } },
};
