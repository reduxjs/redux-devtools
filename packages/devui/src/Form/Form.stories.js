import React from 'react';
import Form from './';
import { schema, uiSchema, formData } from './schema';

export default {
  title: 'Form',
  component: Form,
};

const Template = (args) => <Form {...args} />;

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
