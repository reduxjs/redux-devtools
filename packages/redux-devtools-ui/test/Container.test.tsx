import React from 'react';
import { render } from '@testing-library/react';
import { Container } from '../src';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Container', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Container
        themeData={{
          theme: 'default',
          scheme: 'default',
          colorPreference: 'auto',
        }}
      >
        Text
      </Container>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
