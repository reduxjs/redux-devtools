import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Slider } from '../src';

describe('Slider', function () {
  it('renders correctly', () => {
    const { container } = render(
      <Slider
        onChange={() => {
          // noop
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('renders with props', () => {
    const { container } = render(
      <Slider
        label="Hi"
        min={1}
        max={10}
        value={5}
        disabled
        onChange={() => {
          // noop
        }}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should handle the change event', () => {
    const onChange = jest.fn();
    render(<Slider value={1} onChange={onChange} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(onChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith(2);
  });
});
