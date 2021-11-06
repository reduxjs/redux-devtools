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
      showName: true,
    },
  },
  scheme: {
    name: 'Color Scheme',
    description: 'Global color scheme for components',
    defaultValue: 'default',
    toolbar: {
      items: listSchemes(),
      showName: true,
    },
  },
  color: {
    name: 'Color',
    description: 'Global color for components',
    defaultValue: 'light',
    toolbar: {
      items: ['auto', 'light', 'dark'],
      showName: true,
    },
  },
};

const withThemeProvider = (Story, context) => (
  <Container
    themeData={{
      theme: context.globals.theme,
      scheme: context.globals.scheme,
      colorPreference: context.globals.color,
    }}
  >
    <Story {...context} />
  </Container>
);
export const decorators = [withThemeProvider];
