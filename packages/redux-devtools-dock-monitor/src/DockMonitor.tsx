import React, { cloneElement, Children, Component } from 'react';
import { Dock } from 'react-dock';
import { Action, Dispatch } from 'redux';
import { LiftedState, Monitor } from '@redux-devtools/core';
import {
  toggleVisibility,
  changeMonitor,
  changePosition,
  changeSize,
  DockMonitorAction,
} from './actions';
import reducer, { DockMonitorState } from './reducers';
import parseKey from 'parse-key';

interface KeyObject {
  name: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
  alt: boolean;
  sequence: string;
}

interface ExternalProps<S, A extends Action<string>> {
  defaultPosition: 'left' | 'top' | 'right' | 'bottom';
  defaultIsVisible: boolean;
  defaultSize: number;
  toggleVisibilityKey: string;
  changePositionKey: string;
  changeMonitorKey?: string;
  fluid: boolean;

  dispatch: Dispatch<DockMonitorAction>;

  children:
    | Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>
    | Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>[];
}

interface DefaultProps {
  defaultIsVisible: boolean;
  defaultPosition: 'left' | 'top' | 'right' | 'bottom';
  defaultSize: number;
  fluid: boolean;
}

export interface DockMonitorProps<S, A extends Action<string>>
  extends LiftedState<S, A, DockMonitorState> {
  defaultPosition: 'left' | 'top' | 'right' | 'bottom';
  defaultIsVisible: boolean;
  defaultSize: number;
  toggleVisibilityKey: string;
  changePositionKey: string;
  changeMonitorKey?: string;
  fluid: boolean;

  dispatch: Dispatch<DockMonitorAction>;

  children:
    | Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>
    | Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>[];
}

class DockMonitor<S, A extends Action<string>> extends Component<
  DockMonitorProps<S, A>
> {
  static update = reducer;

  static defaultProps: DefaultProps = {
    defaultIsVisible: true,
    defaultPosition: 'right',
    defaultSize: 0.3,
    fluid: true,
  };

  constructor(props: DockMonitorProps<S, A>) {
    super(props);

    const childrenCount = Children.count(props.children);
    if (childrenCount === 0) {
      // eslint-disable-next-line no-console
      console.error(
        '<DockMonitor> requires at least one monitor inside. ' +
          'Why don’t you try <LogMonitor>? You can get it at ' +
          'https://github.com/reduxjs/redux-devtools/tree/master/packages/redux-devtools-log-monitor.',
      );
    } else if (childrenCount > 1 && !props.changeMonitorKey) {
      // eslint-disable-next-line no-console
      console.error(
        'You specified multiple monitors inside <DockMonitor> ' +
          'but did not provide `changeMonitorKey` prop to change them. ' +
          'Try specifying <DockMonitor changeMonitorKey="ctrl-m" /> ' +
          'and then press Ctrl-M.',
      );
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  matchesKey(key: KeyObject | undefined, event: KeyboardEvent) {
    if (!key) {
      return false;
    }

    const charCode = event.keyCode || event.which;
    const char = String.fromCharCode(charCode);
    return (
      key.name.toUpperCase() === char.toUpperCase() &&
      key.alt === event.altKey &&
      key.ctrl === event.ctrlKey &&
      key.meta === event.metaKey &&
      key.shift === event.shiftKey
    );
  }

  handleKeyDown = (e: KeyboardEvent) => {
    // Ignore regular keys when focused on a field
    // and no modifiers are active.
    if (
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey &&
      ((e.target! as { tagName?: string }).tagName === 'INPUT' ||
        (e.target! as { tagName?: string }).tagName === 'SELECT' ||
        (e.target! as { tagName?: string }).tagName === 'TEXTAREA' ||
        (e.target! as { isContentEditable?: boolean }).isContentEditable)
    ) {
      return;
    }

    const visibilityKey = parseKey(this.props.toggleVisibilityKey);
    const positionKey = parseKey(this.props.changePositionKey);

    let monitorKey;
    if (this.props.changeMonitorKey) {
      monitorKey = parseKey(this.props.changeMonitorKey);
    }

    if (this.matchesKey(visibilityKey, e)) {
      e.preventDefault();
      this.props.dispatch(toggleVisibility());
    } else if (this.matchesKey(positionKey, e)) {
      e.preventDefault();
      this.props.dispatch(changePosition());
    } else if (this.matchesKey(monitorKey, e)) {
      e.preventDefault();
      this.props.dispatch(changeMonitor());
    }
  };

  handleSizeChange = (requestedSize: number) => {
    this.props.dispatch(changeSize(requestedSize));
  };

  renderChild(
    child: Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>,
    index: number,
    otherProps: Omit<
      DockMonitorProps<S, A>,
      'monitorState' | 'children' | 'fluid'
    >,
  ) {
    const { monitorState } = this.props;
    const { childMonitorIndex, childMonitorStates } = monitorState;

    if (index !== childMonitorIndex) {
      return null;
    }

    return cloneElement(child, {
      monitorState: childMonitorStates[index],
      ...otherProps,
    });
  }

  render() {
    const { monitorState, children, fluid, ...rest } = this.props;
    const { position, isVisible, size } = monitorState;

    return (
      <Dock
        position={position}
        isVisible={isVisible}
        size={size}
        fluid={fluid}
        onSizeChange={this.handleSizeChange}
        dimMode="none"
      >
        {Children.map(
          children as
            | Monitor<S, A, LiftedState<S, A, unknown>, unknown, Action<string>>
            | Monitor<
                S,
                A,
                LiftedState<S, A, unknown>,
                unknown,
                Action<string>
              >[],
          (child, index) => this.renderChild(child, index, rest),
        )}
      </Dock>
    );
  }
}

export default DockMonitor as unknown as React.ComponentType<
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    state: DockMonitorState | undefined,
    action: DockMonitorAction,
  ): DockMonitorState;
  defaultProps: DefaultProps;
};
