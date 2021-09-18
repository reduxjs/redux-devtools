import React from 'react';
import { Story } from '@storybook/react';
import Form from './';
import { schema, uiSchema, formData } from './schema';
import { Props as FormProps } from './Form';

export default {
  title: 'Form',
  component: Form,
};

const Template: Story<FormProps<unknown>> = (args) => <Form {...args} />;

export const Default = Template.bind({});
Default.args = {
  formData,
  schema,
  uiSchema,
  submitText: 'Submit',
};
Default.argTypes = {
  children: { control: { disable: true } },
  primaryButton: { control: { disable: true } },
  noSubmit: { control: { disable: true } },
  widgets: { control: { disable: true } },
};
