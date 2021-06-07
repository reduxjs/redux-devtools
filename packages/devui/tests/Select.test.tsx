import React from 'react';
import { render, mount, CommonWrapper, ReactWrapper } from 'enzyme';
import { renderToJson, mountToJson } from 'enzyme-to-json';
import { Select } from '../src';
import { options } from '../src/Select/options';

describe('Select', function () {
  it('renders correctly', () => {
    const wrapper = render(
      <Select
        options={options}
        onChange={() => {
          // noop
        }}
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('renders with props', () => {
    const wrapper = render(
      <Select
        options={options}
        onChange={() => {
          // noop
        }}
        value={options.filter((option) => option.value === 'one')}
        maxMenuHeight={20}
        isClearable
        isDisabled
        isLoading
        isMulti
        isSearchable={false}
        menuPlacement="top"
      />
    );
    expect(renderToJson(wrapper)).toMatchSnapshot();
  });

  it('should select another option', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <Select options={options} onInputChange={onChange} />
    );

    const input = wrapper.find('input');
    ((input.at(0).instance() as unknown) as HTMLInputElement).value = 'two';
    input.first().simulate('change');
    expect(mountToJson(wrapper)).toMatchSnapshot();
    input.first().simulate('keyDown', { keyCode: 13 });
    expect(onChange).toBeCalled();
  });

  it("shouldn't find any results", () => {
    const onChange = jest.fn();
    const wrapper = mount(<Select options={options} onChange={onChange} />);

    const input = wrapper.find('input');
    ((input.at(0).instance() as unknown) as HTMLInputElement).value = 'text';
    input.first().simulate('change');
    expect(mountToJson(wrapper)).toMatchSnapshot(); // 'No results found'
    input.first().simulate('keyDown', { keyCode: 13 });
    expect(onChange).not.toBeCalled();
  });
});
