import React, { Component, MouseEventHandler } from 'react';
import PropTypes from 'prop-types';
import JSONTree from 'react-json-tree';
import { Base16Theme } from 'base16';
import LogMonitorEntryAction from './LogMonitorEntryAction';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { Styling, StylingConfig, StylingValue } from 'react-base16-styling';

const styles: { entry: React.CSSProperties; root: React.CSSProperties } = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none'
  },

  root: {
    marginLeft: 0
  }
};

const getDeepItem = (data: any, path: (string | number)[]) =>
  path.reduce((obj, key) => obj && obj[key], data);
const dataIsEqual = (
  data: any,
  previousData: unknown,
  keyPath: (string | number)[]
) => {
  const path = [...keyPath].reverse().slice(1);

  return getDeepItem(data, path) === getDeepItem(previousData, path);
};

interface Props {
  state: {};
  action: any;
  actionId: number;
  select: (state: any) => any;
  inFuture: boolean;
  error: string | undefined;
  onActionClick: (id: number) => void;
  onActionShiftClick: (id: number) => void;
  collapsed: boolean;
  selected: boolean;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  theme: Base16Theme;
  previousState: any | undefined;
  markStateDiff: boolean;
}

export default class LogMonitorEntry extends Component<Props> {
  static propTypes = {
    state: PropTypes.object.isRequired,
    action: PropTypes.object.isRequired,
    actionId: PropTypes.number.isRequired,
    select: PropTypes.func.isRequired,
    inFuture: PropTypes.bool,
    error: PropTypes.string,
    onActionClick: PropTypes.func.isRequired,
    onActionShiftClick: PropTypes.func.isRequired,
    collapsed: PropTypes.bool,
    selected: PropTypes.bool,
    expandActionRoot: PropTypes.bool,
    expandStateRoot: PropTypes.bool
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  printState(state: any, error: string | undefined) {
    let errorText = error;
    if (!errorText) {
      try {
        const data = this.props.select(state);
        let theme: StylingConfig | Base16Theme;

        if (this.props.markStateDiff) {
          const previousData =
            typeof this.props.previousState !== 'undefined'
              ? this.props.select(this.props.previousState)
              : undefined;
          const getValueStyle: StylingValue = (
            { style }: Styling,
            nodeType: string,
            keyPath: (string | number)[]
          ): Styling => ({
            style: {
              ...style,
              backgroundColor: dataIsEqual(data, previousData, keyPath)
                ? 'transparent'
                : this.props.theme.base01
            }
          });
          const getNestedNodeStyle: StylingValue = (
            { style }: Styling,
            keyPath: (string | number)[]
          ): Styling => ({
            style: {
              ...style,
              ...(keyPath.length > 1 ? {} : styles.root)
            }
          });
          theme = {
            extend: (this.props.theme as unknown) as StylingValue,
            value: getValueStyle,
            nestedNode: getNestedNodeStyle
          };
        } else {
          theme = this.props.theme;
        }

        return (
          <JSONTree
            theme={theme}
            data={data}
            invertTheme={false}
            keyPath={['state']}
            shouldExpandNode={this.shouldExpandNode}
          />
        );
      } catch (err) {
        errorText = 'Error selecting state.';
      }
    }

    return (
      <div
        style={{
          color: this.props.theme.base08,
          paddingTop: 20,
          paddingLeft: 30,
          paddingRight: 30,
          paddingBottom: 35
        }}
      >
        {errorText}
      </div>
    );
  }

  handleActionClick: MouseEventHandler<HTMLDivElement> = e => {
    const { actionId, onActionClick, onActionShiftClick } = this.props;
    if (actionId > 0) {
      if (e.shiftKey) {
        onActionShiftClick(actionId);
      } else {
        onActionClick(actionId);
      }
    }
  };

  shouldExpandNode = (
    keyName: (string | number)[],
    data: unknown,
    level: number
  ) => {
    return this.props.expandStateRoot && level === 0;
  };

  render() {
    const {
      actionId,
      error,
      action,
      state,
      collapsed,
      selected,
      inFuture
    } = this.props;
    const styleEntry: React.CSSProperties = {
      opacity: collapsed ? 0.5 : 1,
      cursor: actionId > 0 ? 'pointer' : 'default'
    };

    return (
      <div
        style={{
          opacity: selected ? 0.4 : inFuture ? 0.6 : 1, // eslint-disable-line no-nested-ternary
          textDecoration: collapsed ? 'line-through' : 'none',
          color: this.props.theme.base06
        }}
      >
        <LogMonitorEntryAction
          theme={this.props.theme}
          collapsed={collapsed}
          action={action}
          expandActionRoot={this.props.expandActionRoot}
          onClick={this.handleActionClick}
          style={{ ...styles.entry, ...styleEntry }}
        />
        {!collapsed && (
          <div style={{ paddingLeft: 16 }}>{this.printState(state, error)}</div>
        )}
      </div>
    );
  }
}
