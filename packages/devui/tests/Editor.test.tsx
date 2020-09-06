import React from 'react';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
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
  const wrapper = mount(
    <Editor
      value="var a = 1;"
      onChange={() => {
        //noop
      }}
    />
  );

  it('renders correctly', () => {
    expect(mountToJson(wrapper)).toMatchSnapshot();
  });

  it('calls getBoundingClientRect', () => {
    expect(getBoundingClientRect).toBeCalled();
  });

  it('calls getClientRects', () => {
    expect(getClientRects).toBeCalled();
  });
});
