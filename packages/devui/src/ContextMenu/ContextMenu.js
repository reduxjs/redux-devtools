import React, { Component } from 'react';
import PropTypes from 'prop-types';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles/index';

const ContextMenuWrapper = createStyledComponent(styles);

export default class ContextMenu extends Component {
  constructor(props) {
    super(props);
    this.updateItems(props.items);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.items !== this.props.items ||
      nextProps.visible !== this.props.visible
    ) {
      this.updateItems(nextProps.items);
    }
  }

  componentDidMount() {
    this.amendPosition();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.x !== this.props.x || prevProps.y !== this.props.y) {
      this.amendPosition();
    }
  }

  onMouseUp = e => {
    e.target.blur();
  };

  onClick = e => {
    this.props.onClick(e.target.value);
  };

  amendPosition() {
    const { x, y } = this.props;
    const { scrollTop, scrollLeft } = document.documentElement;
    const { innerWidth, innerHeight } = window;
    const rect = this.menu.getBoundingClientRect();
    let left = x + scrollLeft;
    let top = y + scrollTop;

    if (y + rect.height > innerHeight) {
      top = innerHeight - rect.height;
    }
    if (x + rect.width > innerWidth) {
      left = innerWidth - rect.width;
    }
    if (top < 0) {
      top = rect.height < innerHeight ? (innerHeight - rect.height) / 2 : 0;
    }
    if (left < 0) {
      left = rect.width < innerWidth ? (innerWidth - rect.width) / 2 : 0;
    }

    this.menu.style.top = `${top}px`;
    this.menu.style.left = `${left}px`;
  }

  updateItems(items) {
    this.items = items.map(item => {
      const value = item.value || item.name;
      if (item.type === 'button') return item;
      return (
        <button
          key={value}
          value={value}
          onMouseUp={this.onMouseUp}
          onClick={this.onClick}
        >
          {item.name}
        </button>
      );
    });
  }

  menuRef = c => {
    this.menu = c;
  };

  render() {
    return (
      <ContextMenuWrapper
        innerRef={this.menuRef}
        left={this.props.x}
        top={this.props.y}
        visible={this.props.visible}
      >
        {this.items}
      </ContextMenuWrapper>
    );
  }
}

ContextMenu.propTypes = {
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  visible: PropTypes.bool
};
