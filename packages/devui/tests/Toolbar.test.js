import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Toolbar, Divider, Spacer, Button } from '../src';

describe('Toolbar', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <Toolbar>
        <Button>1</Button>
        <Divider />
        <Spacer />
        <Button>2</Button>
      </Toolbar>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(<Toolbar borderPosition="top" />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
