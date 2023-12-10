import React, { Component } from 'react';
import createStyledComponent from '../utils/createStyledComponent';
import styles from './styles/index';

const ContextMenuWrapper = createStyledComponent(styles);

type ReactButtonElement = React.ReactElement<
  JSX.IntrinsicElements['button'],
  'button'
>;
type Item = { name: string; value?: string } | ReactButtonElement;

function isReactButtonElement(item: Item): item is ReactButtonElement {
  return (item as ReactButtonElement).type === 'button';
}

export interface ContextMenuProps {
  items: Item[];
  onClick: (value: string) => void;
  x: number;
  y: number;
  visible?: boolean;
}

export default class ContextMenu extends Component<ContextMenuProps> {
  menu?: HTMLDivElement | null;

  componentDidMount() {
    this.amendPosition();
  }

  componentDidUpdate(prevProps: ContextMenuProps) {
    if (prevProps.x !== this.props.x || prevProps.y !== this.props.y) {
      this.amendPosition();
    }
  }

  onMouseUp: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.currentTarget.blur();
  };

  onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    this.props.onClick(e.currentTarget.value);
  };

  amendPosition() {
    const { x, y } = this.props;
    const { scrollTop, scrollLeft } = document.documentElement;
    const { innerWidth, innerHeight } = window;
    const rect = this.menu!.getBoundingClientRect();
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

    this.menu!.style.top = `${top}px`;
    this.menu!.style.left = `${left}px`;
  }

  renderItems() {
    return this.props.items.map((item) => {
      if (isReactButtonElement(item)) return item;
      const value = item.value || item.name;
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

  menuRef: React.RefCallback<HTMLDivElement> = (c) => {
    this.menu = c;
  };

  render() {
    return (
      <ContextMenuWrapper
        ref={this.menuRef}
        left={this.props.x}
        top={this.props.y}
        visible={this.props.visible}
      >
        {this.renderItems()}
      </ContextMenuWrapper>
    );
  }
}
