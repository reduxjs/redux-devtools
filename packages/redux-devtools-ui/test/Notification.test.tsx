import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Notification } from '../src';

describe('Notification', function () {
  it('renders correctly', () => {
    const { container } = render(<Notification>Message</Notification>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(
      <Notification
        type="error"
        onClose={() => {
          // noop
        }}
      >
        Message
      </Notification>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle the click event', async () => {
    const onClose = jest.fn();
    render(<Notification onClose={onClose}>Message</Notification>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });
});
