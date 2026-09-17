import { vi } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Container } from '../src/index.js';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
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
