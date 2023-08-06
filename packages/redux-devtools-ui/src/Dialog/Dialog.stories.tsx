import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Dialog from './';
import { schema, uiSchema, formData } from '../Form/schema';

const meta: Meta = {
  title: 'Dialog',
  component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  args: {
    title: 'Dialog Title',
    submitText: 'Submit!',
    open: true,
    noHeader: false,
    noFooter: false,
    modal: false,
    fullWidth: false,
    children: 'Hello Dialog!',
  },
  argTypes: {
    actions: { control: { disable: true } },
    onDismiss: { control: { disable: true } },
    onSubmit: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};

export const WithForm: Story = {
  args: {
    open: true,
    noHeader: false,
    noFooter: false,
    fullWidth: false,
    submitText: 'Submit!',
    formData,
    schema,
    uiSchema,
  },
  argTypes: {
    title: { control: { disable: true } },
    children: { control: { disable: true } },
    actions: { control: { disable: true } },
    modal: { control: { disable: true } },
    onDismiss: { control: { disable: true } },
    onSubmit: { control: { disable: true } },
    theme: { control: { disable: true } },
  },
};
