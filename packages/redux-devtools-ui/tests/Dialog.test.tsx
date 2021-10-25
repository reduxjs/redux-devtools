import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Dialog } from '../src';

describe('Dialog', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Dialog
        onDismiss={() => {
          // noop
        }}
        onSubmit={() => {
          // noop
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(
      <Dialog
        title="Dialog Title"
        open
        fullWidth
        onDismiss={() => {
          // noop
        }}
        onSubmit={() => {
          // noop
        }}
      >
        Hello Dialog!
      </Dialog>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders modal', () => {
    const { container } = render(
      <Dialog
        modal
        onDismiss={() => {
          // noop
        }}
        onSubmit={() => {
          // noop
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle dismiss event', () => {
    const onDismiss = jest.fn();
    render(
      <Dialog
        open
        onDismiss={onDismiss}
        onSubmit={() => {
          // noop
        }}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onDismiss).toHaveBeenCalled();
  });

  it('should handle submit event', () => {
    const onSubmit = jest.fn();
    render(
      <Dialog
        open
        onDismiss={() => {
          // noop
        }}
        onSubmit={onSubmit}
      />
    );

    userEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
