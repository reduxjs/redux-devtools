import React, { Component } from 'react';
import type { Base16Theme } from 'react-base16-styling';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';

const SegmentedWrapper = createStyledComponent(styles);

export interface SegmentedControlProps {
  values: string[];
  selected?: string;
  onClick: (value: string) => void;
  disabled?: boolean;
  theme?: Base16Theme;
}

export default class SegmentedControl extends Component<SegmentedControlProps> {
  shouldComponentUpdate(nextProps: SegmentedControlProps) {
    return (
      nextProps.disabled !== this.props.disabled ||
      nextProps.selected !== this.props.selected
    );
  }

  onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClick(e.currentTarget.value);
  };

  onMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
  };

  render() {
    const { values, selected } = this.props;
    return (
      <SegmentedWrapper disabled={this.props.disabled} theme={this.props.theme}>
        {values.map((button) => (
          <button
            key={button}
            value={button}
            data-selected={button === selected ? true : undefined}
            onMouseUp={this.onMouseUp}
            onClick={this.onClick}
          >
            {button}
          </button>
        ))}
      </SegmentedWrapper>
    );
  }
}
