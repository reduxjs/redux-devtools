import React from 'react';
import { render } from '@testing-library/react';
import { Toolbar, Divider, Spacer, Button } from '../src';

describe('Toolbar', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Toolbar>
        <Button>1</Button>
        <Divider />
        <Spacer />
        <Button>2</Button>
      </Toolbar>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(<Toolbar borderPosition="top" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
