import React from 'react';
import Dialog from './';
import { schema, uiSchema, formData } from '../Form/schema';

export default {
  title: 'Dialog',
  component: Dialog,
};

const Template = (args) => <Dialog {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: 'Dialog Title',
  submitText: 'Submit!',
  open: true,
  noHeader: false,
  noFooter: false,
  modal: false,
  fullWidth: false,
  children: 'Hello Dialog!',
};
Default.argTypes = {
  actions: { control: { disable: true } },
  onDismiss: { control: { disable: true } },
  onSubmit: { control: { disable: true } },
  theme: { control: { disable: true } },
};

export const WithForm = Template.bind({});
WithForm.args = {
  open: true,
  noHeader: false,
  noFooter: false,
  fullWidth: false,
  submitText: 'Submit!',
  formData,
  schema,
  uiSchema,
};
WithForm.argTypes = {
  title: { control: { disable: true } },
  children: { control: { disable: true } },
  actions: { control: { disable: true } },
  modal: { control: { disable: true } },
  onDismiss: { control: { disable: true } },
  onSubmit: { control: { disable: true } },
  theme: { control: { disable: true } },
};
