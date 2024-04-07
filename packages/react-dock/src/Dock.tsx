import React, { Component, ReactNode } from 'react';
import { debounce } from 'lodash-es';
import type { DebouncedFunc } from 'lodash-es';
import autoprefix from './autoprefix.js';

interface Styles {
  [key: string]: React.CSSProperties;
}

function autoprefixes(styles: Styles) {
  return Object.keys(styles).reduce<Styles>(
    (obj, key) => ((obj[key] = autoprefix(styles[key])), obj),
    {},
  );
}

const styles = autoprefixes({
  wrapper: {
    position: 'fixed',
    width: 0,
    height: 0,
    top: 0,
    left: 0,
  },

  dim: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    opacity: 1,
  },

  dimAppear: {
    opacity: 0,
  },

  dimTransparent: {
    pointerEvents: 'none',
  },

  dimHidden: {
    opacity: 0,
  },

  dock: {
    position: 'fixed',
    zIndex: 1,
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
    background: 'white',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },

  dockHidden: {
    opacity: 0,
  },

  dockResizing: {
    transition: 'none',
  },

  dockContent: {
    width: '100%',
    height: '100%',
    overflow: 'auto',
  },

  resizer: {
    position: 'absolute',
    zIndex: 2,
    opacity: 0,
  },
});

function getTransitions(duration: number) {
  return ['left', 'top', 'width', 'height'].map(
    (p) => `${p} ${duration / 1000}s ease-out`,
  );
}

function getDockStyles(
  { fluid, dockStyle, dockHiddenStyle, duration, position, isVisible }: Props,
  { size, isResizing, fullWidth, fullHeight }: State,
) {
  let posStyle;
  const absSize = fluid ? `${size * 100}%` : `${size}px`;

  function getRestSize(fullSize: number) {
    return fluid ? `${100 - size * 100}%` : `${fullSize - size}px`;
  }

  switch (position) {
    case 'left':
      posStyle = {
        width: absSize,
        left: isVisible ? 0 : '-' + absSize,
      };
      break;
    case 'right':
      posStyle = {
        left: isVisible ? getRestSize(fullWidth) : fullWidth,
        width: absSize,
      };
      break;
    case 'top':
      posStyle = {
        top: isVisible ? 0 : '-' + absSize,
        height: absSize,
      };
      break;
    case 'bottom':
      posStyle = {
        top: isVisible ? getRestSize(fullHeight) : fullHeight,
        height: absSize,
      };
      break;
  }

  const transitions = getTransitions(duration);

  return [
    styles.dock,
    autoprefix({
      transition: [
        ...transitions,
        !isVisible && `opacity 0.01s linear ${duration / 1000}s`,
      ]
        .filter((t) => t)
        .join(','),
    }),
    dockStyle,
    autoprefix(posStyle),
    isResizing && styles.dockResizing,
    !isVisible && styles.dockHidden,
    !isVisible && dockHiddenStyle,
  ];
}

function getDimStyles(
  { dimMode, dimStyle, duration, isVisible }: Props,
  { isTransitionStarted }: State,
) {
  return [
    styles.dim,
    autoprefix({
      transition: `opacity ${duration / 1000}s ease-out`,
    }),
    dimStyle,
    dimMode === 'transparent' && styles.dimTransparent,
    !isVisible && styles.dimHidden,
    isTransitionStarted && isVisible && styles.dimAppear,
    isTransitionStarted && !isVisible && styles.dimDisappear,
  ];
}

function getResizerStyles(position: 'left' | 'right' | 'top' | 'bottom') {
  let resizerStyle;
  const size = 10;

  switch (position) {
    case 'left':
      resizerStyle = {
        right: -size / 2,
        width: size,
        top: 0,
        height: '100%',
        cursor: 'col-resize',
      };
      break;
    case 'right':
      resizerStyle = {
        left: -size / 2,
        width: size,
        top: 0,
        height: '100%',
        cursor: 'col-resize',
      };
      break;
    case 'top':
      resizerStyle = {
        bottom: -size / 2,
        height: size,
        left: 0,
        width: '100%',
        cursor: 'row-resize',
      };
      break;
    case 'bottom':
      resizerStyle = {
        top: -size / 2,
        height: size,
        left: 0,
        width: '100%',
        cursor: 'row-resize',
      };
      break;
  }

  return [styles.resizer, autoprefix(resizerStyle)];
}

function getFullSize(
  position: 'left' | 'right' | 'top' | 'bottom',
  fullWidth: number,
  fullHeight: number,
) {
  return position === 'left' || position === 'right' ? fullWidth : fullHeight;
}

interface Props {
  position: 'left' | 'right' | 'top' | 'bottom';
  zIndex: number;
  fluid: boolean;
  size?: number;
  defaultSize: number;
  dimMode: 'none' | 'transparent' | 'opaque';
  isVisible?: boolean;
  onVisibleChange?: (isVisible: boolean) => void;
  onSizeChange?: (size: number) => void;
  dimStyle?: React.CSSProperties | null;
  dockStyle?: React.CSSProperties | null;
  dockHiddenStyle?: React.CSSProperties | null;
  duration: number;
  children?:
    | React.FunctionComponent<{
        position: 'left' | 'right' | 'top' | 'bottom';
        isResizing: boolean | undefined;
        size: number;
        isVisible: boolean | undefined;
      }>
    | ReactNode;
}

interface State {
  isControlled: boolean;
  size: number;
  isDimHidden: boolean;
  fullWidth: number;
  fullHeight: number;
  isTransitionStarted: boolean;
  isWindowResizing: unknown;
  isResizing?: boolean;
}

export default class Dock extends Component<Props, State> {
  state: State = {
    isControlled: typeof this.props.size !== 'undefined',
    size: this.props.size || this.props.defaultSize,
    isDimHidden: !this.props.isVisible,
    fullWidth: window.innerWidth,
    fullHeight: window.innerHeight,
    isTransitionStarted: false,
    isWindowResizing: false,
  };

  static defaultProps = {
    position: 'left',
    zIndex: 99999999,
    fluid: true,
    defaultSize: 0.3,
    dimMode: 'opaque',
    duration: 200,
  };

  componentDidMount() {
    window.addEventListener('touchend', this.handleMouseUp);
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('touchmove', this.handleMouseMove);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);

    this.updateWindowSize();
  }

  componentWillUnmount() {
    window.removeEventListener('touchend', this.handleMouseUp);
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('touchmove', this.handleMouseMove);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const isControlled = typeof nextProps.size !== 'undefined';

    this.setState({ isControlled });

    if (isControlled && nextProps.size && this.props.size !== nextProps.size) {
      this.setState({ size: nextProps.size });
    } else if (this.props.fluid !== nextProps.fluid) {
      this.updateSize(nextProps);
    }

    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({
        isTransitionStarted: true,
      });
    }
  }

  updateSize(props: Props) {
    const { fullWidth, fullHeight } = this.state;

    this.setState({
      size: props.fluid
        ? this.state.size / getFullSize(props.position, fullWidth, fullHeight)
        : getFullSize(props.position, fullWidth, fullHeight) * this.state.size,
    });
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.isVisible !== prevProps.isVisible) {
      if (!this.props.isVisible) {
        window.setTimeout(() => this.hideDim(), this.props.duration);
      } else {
        this.setState({ isDimHidden: false });
      }

      window.setTimeout(() => this.setState({ isTransitionStarted: false }), 0);
    }
  }

  transitionEnd = () => {
    this.setState({ isTransitionStarted: false });
  };

  hideDim = () => {
    if (!this.props.isVisible) {
      this.setState({ isDimHidden: true });
    }
  };

  render() {
    const { children, zIndex, dimMode, position, isVisible } = this.props;
    const { isResizing, size, isDimHidden } = this.state;

    const dimStyles = Object.assign(
      {},
      ...getDimStyles(this.props, this.state),
    );
    const dockStyles = Object.assign(
      {},
      ...getDockStyles(this.props, this.state),
    );
    const resizerStyles = Object.assign({}, ...getResizerStyles(position));

    return (
      <div style={Object.assign({}, styles.wrapper, { zIndex })}>
        {dimMode !== 'none' && !isDimHidden && (
          <div style={dimStyles} onClick={this.handleDimClick} />
        )}
        <div style={dockStyles}>
          <div
            style={resizerStyles}
            onMouseDown={this.handleMouseDown}
            onTouchStart={this.handleMouseDown}
          />
          <div style={styles.dockContent}>
            {typeof children === 'function'
              ? (
                  children as React.FunctionComponent<{
                    position: 'left' | 'right' | 'top' | 'bottom';
                    isResizing: boolean | undefined;
                    size: number;
                    isVisible: boolean | undefined;
                  }>
                )({
                  position,
                  isResizing,
                  size,
                  isVisible,
                })
              : children}
          </div>
        </div>
      </div>
    );
  }

  handleDimClick = () => {
    if (this.props.dimMode === 'opaque') {
      this.props.onVisibleChange && this.props.onVisibleChange(false);
    }
  };

  handleResize = () => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.updateWindowSize.bind(this, true));
    } else {
      this.updateWindowSize(true);
    }
  };

  updateWindowSize = (windowResize?: true) => {
    const sizeState = {
      fullWidth: window.innerWidth,
      fullHeight: window.innerHeight,
    };

    if (windowResize) {
      this.setState({
        ...sizeState,
        isResizing: true,
        isWindowResizing: windowResize,
      });

      this.debouncedUpdateWindowSizeEnd();
    } else {
      this.setState(sizeState);
    }
  };

  updateWindowSizeEnd = () => {
    this.setState({
      isResizing: false,
      isWindowResizing: false,
    });
  };

  debouncedUpdateWindowSizeEnd: DebouncedFunc<() => void> = debounce(
    this.updateWindowSizeEnd,
    30,
  );

  handleWrapperLeave = () => {
    this.setState({ isResizing: false });
  };

  handleMouseDown = () => {
    this.setState({ isResizing: true });
  };

  handleMouseUp = () => {
    this.setState({ isResizing: false });
  };

  handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!this.state.isResizing || this.state.isWindowResizing) return;

    if (!(e as TouchEvent).touches) e.preventDefault();

    const { position, fluid } = this.props;
    const { fullWidth, fullHeight, isControlled } = this.state;
    let { clientX: x, clientY: y } = e as MouseEvent;

    if ((e as TouchEvent).touches) {
      x = (e as TouchEvent).touches[0].clientX;
      y = (e as TouchEvent).touches[0].clientY;
    }

    let size;

    switch (position) {
      case 'left':
        size = fluid ? x / fullWidth : x;
        break;
      case 'right':
        size = fluid ? (fullWidth - x) / fullWidth : fullWidth - x;
        break;
      case 'top':
        size = fluid ? y / fullHeight : y;
        break;
      case 'bottom':
        size = fluid ? (fullHeight - y) / fullHeight : fullHeight - y;
        break;
    }

    this.props.onSizeChange && this.props.onSizeChange(size);

    if (!isControlled) {
      this.setState({ size });
    }
  };
}
