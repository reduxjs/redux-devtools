import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import Editor from './';
import { default as WithTabsComponent, WithTabsProps } from './WithTabs';

const value = `
var themes = [];

function getThemes() {
  return themes;
}
`;

const meta: Meta = {
  title: 'Editor',
  component: Editor,
};

export default meta;

type Story = StoryObj<typeof Editor>;

export const Default: Story = {
  args: {
    value,
    lineNumbers: true,
    lineWrapping: false,
    foldGutter: true,
    readOnly: false,
    autofocus: true,
  },
  argTypes: {
    autofocus: { control: { disable: true } },
    mode: { control: { disable: true } },
    theme: { control: { disable: true } },
    onChange: { control: { disable: true } },
  },
};

export const WithTabs: StoryObj<WithTabsProps> = {
  render: (args) => <WithTabsComponent {...args} />,
  args: {
    lineNumbers: true,
    position: 'left',
  },
  argTypes: {
    value: { control: { disable: true } },
    mode: { control: { disable: true } },
    lineWrapping: { control: { disable: true } },
    readOnly: { control: { disable: true } },
    theme: { control: { disable: true } },
    foldGutter: { control: { disable: true } },
    autofocus: { control: { disable: true } },
    onChange: { control: { disable: true } },
  } as any,
};
