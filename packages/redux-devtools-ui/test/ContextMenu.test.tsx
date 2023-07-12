import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenu } from '../src';
import { items } from '../src/ContextMenu/data';

describe('ContextMenu', function () {
  it('renders correctly', () => {
    const { container } = render(
      <ContextMenu
        items={items}
        onClick={() => {
          // noop
        }}
        x={100}
        y={100}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it('should handle the click event', async () => {
    const onClick = jest.fn();
    render(
      <ContextMenu items={items} onClick={onClick} x={100} y={100} visible />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Menu Item 1' }));
    expect(onClick).toHaveBeenCalled();
  });
});
