import React from 'react';
import { render, mount } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import { Select } from '../src';
import { options } from '../src/Select/stories/options';

describe('Select', function() {
  it('renders correctly', () => {
    const wrapper = render(<Select options={options} onChange={() => {}} />);
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Select
        options={options}
        onChange={() => {}}
        value="one"
        menuMaxHeight={20}
        clearable
        disabled
        isLoading
        multi
        searchable={false}
        openOuterUp
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should select another option', () => {
    const onChange = jest.fn();
    const wrapper = mount(<Select options={options} onChange={onChange} />);

    const input = wrapper.find('input');
    input.at(0).instance().value = 'two';
    input.first().simulate('change');
    expect(mountToJson(wrapper)).toMatchSnapshot();
    input.first().simulate('keyDown', { keyCode: 13 });
    expect(onChange).toBeCalled();
  });

  it("shouldn't find any results", () => {
    const onChange = jest.fn();
    const wrapper = mount(<Select options={options} onChange={onChange} />);

    const input = wrapper.find('input');
    input.at(0).instance().value = 'text';
    input.first().simulate('change');
    expect(mountToJson(wrapper)).toMatchSnapshot(); // 'No results found'
    input.first().simulate('keyDown', { keyCode: 13 });
    expect(onChange).not.toBeCalled();
  });
});
