import { vi } from 'vitest';
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from '../../../src/devpanel/store/panelStore.js';
import App from '../../../src/app/App.js';

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

const { store } = configureStore();

describe('App container', () => {
  it("should render inspector monitor's component", () => {
    render(
      <Provider store={store}>
        <App position="devtools-left" />
      </Provider>,
    );
    expect(screen.getByTestId('inspector')).toBeDefined();
  });

  it('should contain an empty action list', () => {
    render(
      <Provider store={store}>
        <App position="devtools-left" />
      </Provider>,
    );
    const actionList = screen.getByTestId('actionList');
    expect(within(actionList).queryByRole('button')).not.toBeInTheDocument();
  });
});
