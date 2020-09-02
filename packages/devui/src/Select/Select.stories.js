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

const Template = (args) => (
  <Container>
    <Select options={options} {...args} />
  </Container>
);

export const Default = Template.bind({});
Default.args = {
  value: 'one',
  menuMaxHeight: 200,
  autosize: false,
  clearable: false,
  disabled: false,
  isLoading: false,
  multi: false,
  searchable: true,
  openOuterUp: false,
};
Default.argTypes = {
  simpleValue: { control: { disable: true } },
  valueKey: { control: { disable: true } },
};
