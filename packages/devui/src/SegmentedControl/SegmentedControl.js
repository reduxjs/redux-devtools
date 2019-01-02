import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles';

const SegmentedWrapper = createStyledComponent(styles);

export default class SegmentedControl extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.disabled !== this.props.disabled ||
      nextProps.selected !== this.props.selected;
  }

  onClick = e => {
    this.props.onClick(e.target.value);
  };

  onMouseUp = e => {
    e.target.blur();
  };

  render() {
    const { values, selected } = this.props;
    return (
      <SegmentedWrapper disabled={this.props.disabled} theme={this.props.theme}>
        {values.map(button => (
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

SegmentedControl.propTypes = {
  values: PropTypes.array.isRequired,
  selected: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  theme: PropTypes.object
};
