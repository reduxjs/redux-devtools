import React from 'react';
import { render } from '@testing-library/react';
import { Editor } from '../src';
import 'codemirror/mode/javascript/javascript';

describe('Editor', function () {
  const getBoundingClientRect = jest.fn();
  const getClientRects = jest.fn();

  // See https://github.com/jsdom/jsdom/issues/3002
  document.createRange = () => {
    const range = new Range();

    range.getBoundingClientRect = getBoundingClientRect;

    range.getClientRects = () => {
      getClientRects();
      return {
        item: () => null,
        length: 0,
        [Symbol.iterator]: jest.fn(),
      };
    };

    return range;
  };
  const { container } = render(<Editor value="var a = 1;" />);

  it('renders correctly', () => {
    expect(container.firstChild).toMatchSnapshot();
  });

  it('calls getBoundingClientRect', () => {
    expect(getBoundingClientRect).toHaveBeenCalled();
  });

  it('calls getClientRects', () => {
    expect(getClientRects).toHaveBeenCalled();
  });
});
