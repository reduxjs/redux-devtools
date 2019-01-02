import React from 'react';
import { mount } from 'enzyme';
import { mountToJson } from 'enzyme-to-json';
import { Editor } from '../src';
import 'codemirror/mode/javascript/javascript';

describe('Editor', function () {
  const getBoundingClientRect = jest.fn();
  const getClientRects = jest.fn();
  document.body.createTextRange = function () {
    return {
      getBoundingClientRect() {
        getBoundingClientRect();
        return {};
      },
      getClientRects() {
        getClientRects();
        return {};
      }
    };
  };
  const wrapper = mount(<Editor value="var a = 1;" />);

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
