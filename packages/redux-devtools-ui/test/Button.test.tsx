import { vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { Button } from '../src/index.js';

describe('Button', function () {
  it('renders correctly', () => {
    const { container } = render(<Button>Text</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle the click event', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>ClickMe</Button>);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
