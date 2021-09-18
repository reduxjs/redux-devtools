import React from 'react';
import { Container } from '../src';
import { listSchemes, listThemes } from '../src/utils/theme';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'default',
    toolbar: {
      items: listThemes(),
    },
  },
  scheme: {
    name: 'Color Scheme',
    description: 'Global color scheme for components',
    defaultValue: 'default',
    toolbar: {
      items: listSchemes(),
    },
  },
  color: {
    name: 'Color',
    description: 'Global color for components',
    defaultValue: 'light',
    toolbar: {
      items: ['light', 'dark'],
    },
  },
};

const withThemeProvider = (Story, context) => (
  <Container
    themeData={{
      theme: context.globals.theme,
      scheme: context.globals.scheme,
      light: context.globals.color === 'light',
    }}
  >
    <Story {...context} />
  </Container>
);
export const decorators = [withThemeProvider];
