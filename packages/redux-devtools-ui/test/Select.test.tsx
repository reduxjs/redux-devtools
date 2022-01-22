import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../src';
import { options } from '../src/Select/options';

describe('Select', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Select
        options={options}
        onChange={() => {
          // noop
        }}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(
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
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should select another option', () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select options={options} onChange={onChange} />
    );

    userEvent.type(screen.getByRole('combobox'), 'two');
    expect(container.firstChild).toMatchSnapshot();
    userEvent.type(screen.getByRole('combobox'), '{enter}');
    expect(onChange).toHaveBeenCalled();
  });

  it("shouldn't find any results", () => {
    const onChange = jest.fn();
    const { container } = render(
      <Select options={options} onChange={onChange} />
    );

    userEvent.type(screen.getByRole('combobox'), 'text');
    expect(container.firstChild).toMatchSnapshot();
    userEvent.type(screen.getByRole('combobox'), '{enter}');
    expect(onChange).not.toHaveBeenCalled();
  });
});
