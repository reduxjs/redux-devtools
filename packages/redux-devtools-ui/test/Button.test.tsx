import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../src';

describe('Button', function () {
  it('renders correctly', () => {
    const { container } = render(<Button>Text</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle the click event', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>ClickMe</Button>);

    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
