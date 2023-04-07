import React from 'react';
import styled from 'styled-components';
import Select from './';
import { options } from './options';
import { Meta, StoryObj } from '@storybook/react';

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  > div {
    width: 90%;
  }
`;

const meta: Meta = {
  title: 'Select',
  component: Select,
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: ({ value, ...args }) => (
    <Container>
      <Select
        options={options}
        value={options.filter((option) => option.value === value)}
        {...args}
      />
    </Container>
  ),
  args: {
    value: 'one',
    maxMenuHeight: 300,
    isClearable: false,
    isDisabled: false,
    isLoading: false,
    isMulti: false,
    isSearchable: true,
    menuPlacement: 'bottom',
  },
  argTypes: {
    onChange: {
      action: 'selected',
    },
  },
};
