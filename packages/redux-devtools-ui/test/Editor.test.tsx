import React from 'react';
import { render } from '@testing-library/react';
import { Editor } from '../src';

describe('Editor', function () {
  const { container } = render(<Editor value="var a = 1;" />);

  it('renders correctly', () => {
    expect(container.firstChild).toMatchSnapshot();
  });
});
