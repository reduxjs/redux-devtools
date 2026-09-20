import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SegmentedControl } from '../src/index.js';

describe('SegmentedControl', function () {
  it('renders correctly', () => {
    const { container } = render(
      <SegmentedControl
        values={['Button1', 'Button2', 'Button3']}
        selected="Button1"
        disabled={false}
        onClick={() => {
          // noop
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should handle the click event', async () => {
    const onClick = vi.fn();
    render(
      <SegmentedControl
        values={['Button1', 'Button2', 'Button3']}
        selected="Button1"
        disabled={false}
        onClick={onClick}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Button1' }));
    expect(onClick).toHaveBeenCalled();
  });
});
