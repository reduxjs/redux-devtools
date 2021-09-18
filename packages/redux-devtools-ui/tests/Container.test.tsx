import React from 'react';
import { render } from 'enzyme';
import { renderToJson } from 'enzyme-to-json';
import { Container } from '../src';

describe('Container', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <Container
        themeData={{ theme: 'default', scheme: 'default', light: false }}
      >
        Text
      </Container>
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });
});
