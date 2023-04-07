import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Form from './';
import { schema, uiSchema, formData } from './schema';

const meta: Meta = {
  title: 'Form',
  component: Form,
};

export default meta;

type Story = StoryObj<typeof Form>;

export const Default: Story = {
  args: {
    formData,
    schema,
    uiSchema,
    submitText: 'Submit',
  },
  argTypes: {
    children: { control: { disable: true } },
    primaryButton: { control: { disable: true } },
    noSubmit: { control: { disable: true } },
    widgets: { control: { disable: true } },
  },
};
