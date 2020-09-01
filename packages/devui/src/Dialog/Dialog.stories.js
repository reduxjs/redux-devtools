import React from 'react';
import Dialog from './';
import { schema, uiSchema, formData } from '../Form/stories/schema';

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
  actions: { table: { disable: true } },
  onDismiss: { table: { disable: true } },
  onSubmit: { table: { disable: true } },
  theme: { table: { disable: true } },
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
  title: { table: { disable: true } },
  children: { table: { disable: true } },
  actions: { table: { disable: true } },
  modal: { table: { disable: true } },
  onDismiss: { table: { disable: true } },
  onSubmit: { table: { disable: true } },
  theme: { table: { disable: true } },
};
