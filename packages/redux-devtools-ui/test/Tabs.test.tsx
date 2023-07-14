import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../src';
import { tabs, simple10Tabs } from '../src/Tabs/data';

describe('Tabs', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Tabs
        tabs={tabs}
        onClick={() => {
          // noop
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(
      <Tabs
        tabs={tabs}
        onClick={() => {
          // noop
        }}
        selected="Tab2"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders tabs without inner components', () => {
    const { container } = render(
      <Tabs
        tabs={simple10Tabs}
        onClick={() => {
          // noop
        }}
        selected="5"
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should select tab', async () => {
    const onClick = jest.fn();
    render(<Tabs tabs={tabs} onClick={onClick} />);

    await userEvent.click(screen.getByRole('button', { name: 'Tab1' }));
    expect(onClick).toHaveBeenCalled();
  });
});
