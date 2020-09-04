import React from 'react';
import styled from 'styled-components';
import Select from './';
import { options } from './options';

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

const Template = ({ value, ...args }) => (
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
