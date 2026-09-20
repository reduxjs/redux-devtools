import React from 'react';
import styled from '@emotion/styled';
import { Meta, StoryObj } from '@storybook/react-vite';
import ContextMenu from './index.js';
import { items } from './data.js';

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
