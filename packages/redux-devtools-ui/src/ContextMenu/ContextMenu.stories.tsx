import React from 'react';
import styled from 'styled-components';
import { Meta, StoryObj } from '@storybook/react';
import ContextMenu from './';
import { items } from './data';

const meta: Meta = {
  title: 'ContextMenu',
  component: ContextMenu,
};

export default meta;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

type Story = StoryObj<typeof ContextMenu>;

export const Default: Story = {
  render: (args) => (
    <Container>
      <ContextMenu {...args} />
    </Container>
  ),
  args: {
    visible: true,
    x: 100,
    y: 100,
    items,
  },
  argTypes: {
    visible: { control: { disable: true } },
    items: { control: { disable: true } },
    onClick: { control: { disable: true } },
  },
};
