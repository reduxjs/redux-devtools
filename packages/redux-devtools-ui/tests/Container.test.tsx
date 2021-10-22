import React from 'react';
import { render } from '@testing-library/react';
import { Container } from '../src';

describe('Container', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Container
        themeData={{ theme: 'default', scheme: 'default', light: false }}
      >
        Text
      </Container>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
