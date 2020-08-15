import React, { Component } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import autoprefix from './autoprefix';

function autoprefixes(styles) {
  return Object.keys(styles).reduce(
    (obj, key) => (obj[key] = autoprefix(styles[key]), obj),
    {}
  );
}

const styles = autoprefixes({
  wrapper: {
    position: 'fixed',
    width: 0,
    height: 0,
    top: 0,
    left: 0
  },

  dim: {
    position: 'fixed',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0,
    background: 'rgba(0, 0, 0, 0.2)',
    opacity: 1
  },

  dimAppear: {
    opacity: 0
  },

  dimTransparent: {
    pointerEvents: 'none'
  },

  dimHidden: {
    opacity: 0
  },

  dock: {
    position: 'fixed',
    zIndex: 1,
    boxShadow: '0 0 4px rgba(0, 0, 0, 0.3)',
    background: 'white',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },

  dockHidden: {
    opacity: 0
  },

  dockResizing: {
    transition: 'none'
  },

  dockContent: {
    width: '100%',
    height: '100%',
    overflow: 'auto'
  },

  resizer: {
    position: 'absolute',
    zIndex: 2,
    opacity: 0
  }
});

function getTransitions(duration) {
  return ['left', 'top', 'width', 'height']
  .map(p => `${p} ${duration/1000}s ease-out`);
}

function getDockStyles(
  { fluid, dockStyle, dockHiddenStyle, duration, position, isVisible },
  { size, isResizing, fullWidth, fullHeight }
) {
  let posStyle;
  const absSize = fluid ?
    (size * 100) + '%' :
    size + 'px';

  function getRestSize(fullSize) {
    return fluid ?
      (100 - size * 100) + '%' :
      (fullSize - size) + 'px';
  }

  switch(position) {
  case 'left':
    posStyle = {
      width: absSize,
      left: isVisible ? 0 : '-' + absSize
    };
    break;
  case 'right':
    posStyle = {
      left: isVisible ? getRestSize(fullWidth) : fullWidth,
      width: absSize
    };
    break;
  case 'top':
    posStyle = {
      top: isVisible ? 0 : '-' + absSize,
      height: absSize
    };
    break;
  case 'bottom':
    posStyle = {
      top: isVisible ? getRestSize(fullHeight) : fullHeight,
      height: absSize
    };
    break;
  }

  const transitions = getTransitions(duration);

  return [
    styles.dock,
    autoprefix({
      transition: [
        ...transitions,
        !isVisible && `opacity 0.01s linear ${duration/1000}s`
      ].filter(t => t).join(',')
    }),
    dockStyle,
    autoprefix(posStyle),
    isResizing && styles.dockResizing,
    !isVisible && styles.dockHidden,
    !isVisible && dockHiddenStyle,
  ];
}

function getDimStyles(
  { dimMode, dimStyle, duration, isVisible },
  { isTransitionStarted }
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
    isTransitionStarted && !isVisible && styles.dimDisappear
  ];
}

function getResizerStyles(position) {
  let resizerStyle;
  const size = 10;

  switch(position) {
  case 'left':
    resizerStyle = {
      right: -size / 2,
      width: size,
      top: 0,
      height: '100%',
      cursor: 'col-resize'
    };
    break;
  case 'right':
    resizerStyle = {
      left: -size / 2,
      width: size,
      top: 0,
      height: '100%',
      cursor: 'col-resize'
    };
    break;
  case 'top':
    resizerStyle = {
      bottom: -size / 2,
      height: size,
      left: 0,
      width: '100%',
      cursor: 'row-resize'
    };
    break;
  case 'bottom':
    resizerStyle = {
      top: -size / 2,
      height: size,
      left: 0,
      width: '100%',
      cursor: 'row-resize'
    };
    break;
  }

  return [
    styles.resizer,
    autoprefix(resizerStyle)
  ];
}

function getFullSize(position, fullWidth, fullHeight) {
  return position === 'left' || position === 'right' ?
    fullWidth :
    fullHeight;
}

export default class Dock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isControlled: typeof props.size !== 'undefined',
      size: props.size || props.defaultSize,
      isDimHidden: !props.isVisible,
      fullWidth: typeof(window) !== 'undefined' && window.innerWidth,
      fullHeight: typeof(window) !== 'undefined' && window.innerHeight,
      isTransitionStarted: false,
      isWindowResizing: false
    };
  }

  static propTypes = {
    position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
    zIndex: PropTypes.number,
    fluid: PropTypes.bool,
    size: PropTypes.number,
    defaultSize: PropTypes.number,
    dimMode: PropTypes.oneOf(['none', 'transparent', 'opaque']),
    isVisible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    onSizeChange: PropTypes.func,
    dimStyle: PropTypes.object,
    dockStyle: PropTypes.object,
    duration: PropTypes.number
  }

  static defaultProps = {
    position: 'left',
    zIndex: 99999999,
    fluid: true,
    defaultSize: 0.3,
    dimMode: 'opaque',
    duration: 200
  }

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseUp);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('resize', this.handleResize);

    if (!window.fullWidth) {
      this.updateWindowSize();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.handleMouseUp);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    const isControlled = typeof nextProps.size !== 'undefined';

    this.setState({ isControlled });

    if (isControlled && this.props.size !== nextProps.size) {
      this.setState({ size: nextProps.size });
    } else if (this.props.fluid !== nextProps.fluid) {
      this.updateSize(nextProps);
    }

    if (this.props.isVisible !== nextProps.isVisible) {
      this.setState({
        isTransitionStarted: true
      });
    }
  }

  updateSize(props) {
    const { fullWidth, fullHeight } = this.state;

    this.setState({
      size: props.fluid ?
        this.state.size / getFullSize(props.position, fullWidth, fullHeight) :
        getFullSize(props.position, fullWidth, fullHeight) * this.state.size
    });
  }

  componentDidUpdate(prevProps) {
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
  }

  hideDim = () => {
    if (!this.props.isVisible) {
      this.setState({ isDimHidden: true });
    }
  }

  render() {
    const { children, zIndex, dimMode, position, isVisible } = this.props;
    const { isResizing, size, isDimHidden } = this.state;

    const dimStyles = Object.assign({}, ...getDimStyles(this.props, this.state));
    const dockStyles = Object.assign({}, ...getDockStyles(this.props, this.state));
    const resizerStyles = Object.assign({}, ...getResizerStyles(position));

    return (
      <div style={Object.assign({}, styles.wrapper, { zIndex })}>
        {dimMode !== 'none' && !isDimHidden &&
          <div style={dimStyles} onClick={this.handleDimClick} />
        }
        <div style={dockStyles}>
          <div style={resizerStyles}
               onMouseDown={this.handleMouseDown} />
          <div style={styles.dockContent}>
            {typeof children === 'function' ?
              children({
                position,
                isResizing,
                size,
                isVisible
              }) :
              children
            }
          </div>
        </div>
      </div>
    );
  }

  handleDimClick = () => {
    if (this.props.dimMode === 'opaque') {
      this.props.onVisibleChange && this.props.onVisibleChange(false);
    }
  }

  handleResize = () => {
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.updateWindowSize.bind(this, true));
    } else {
      this.updateWindowSize(true);
    }
  }

  updateWindowSize = (windowResize) => {
    const sizeState = {
      fullWidth: window.innerWidth,
      fullHeight: window.innerHeight,
    };

    if (windowResize) {
      this.setState({
        ...sizeState,
        isResizing: true,
        isWindowResizing: windowResize
      });

      this.debouncedUpdateWindowSizeEnd();
    } else {
      this.setState(sizeState);
    }
  }

  updateWindowSizeEnd = () => {
    this.setState({
      isResizing: false,
      isWindowResizing: false
    });
  }

  debouncedUpdateWindowSizeEnd = debounce(this.updateWindowSizeEnd, 30)

  handleWrapperLeave = () => {
    this.setState({ isResizing: false });
  }

  handleMouseDown = () => {
    this.setState({ isResizing: true });
  }

  handleMouseUp = () => {
    this.setState({ isResizing: false });
  }

  handleMouseMove = e => {
    if (!this.state.isResizing || this.state.isWindowResizing) return;
    e.preventDefault();

    const { position, fluid } = this.props;
    const { fullWidth, fullHeight, isControlled } = this.state;
    const { clientX: x, clientY: y } = e;
    let size;

    switch(position) {
    case 'left':
      size = fluid ? x / fullWidth : x;
      break;
    case 'right':
      size = fluid ? (fullWidth - x) / fullWidth : (fullWidth - x);
      break;
    case 'top':
      size = fluid ? y / fullHeight : y;
      break;
    case 'bottom':
      size = fluid ? (fullHeight - y) / fullHeight : (fullHeight - y);
      break;
    }

    this.props.onSizeChange && this.props.onSizeChange(size);

    if (!isControlled) {
      this.setState({ size });
    }
  }
}
