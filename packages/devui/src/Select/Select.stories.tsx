import React from 'react';
import styled from 'styled-components';
import Select from './';
import { options } from './options';
import { Story } from '@storybook/react';
import { SelectProps } from './Select';

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

export default {
  title: 'Select',
  component: Select,
};

type TemplateArgs = Omit<
  SelectProps<{ value: string; label: string }, boolean>,
  'value'
> & { value: string };

// eslint-disable-next-line react/prop-types
const Template: Story<TemplateArgs> = ({ value, ...args }) => (
  <Container>
    <Select
      options={options}
      value={options.filter((option) => option.value === value)}
      {...args}
    />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  value: 'one',
  maxMenuHeight: 300,
  isClearable: false,
  isDisabled: false,
  isLoading: false,
  isMulti: false,
  isSearchable: true,
  menuPlacement: 'bottom',
};
Default.argTypes = {
  onChange: {
    action: 'selected',
  },
};
