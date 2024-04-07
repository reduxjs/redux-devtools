import React, { CSSProperties, MouseEventHandler, PureComponent } from 'react';
import { JSONTree } from 'react-json-tree';
import type { ShouldExpandNodeInitially, StylingValue } from 'react-json-tree';
import type { Base16Theme } from 'react-base16-styling';
import { Action } from 'redux';
import LogMonitorEntryAction from './LogMonitorEntryAction';

const styles: { entry: CSSProperties; root: CSSProperties } = {
  entry: {
    display: 'block',
    WebkitUserSelect: 'none',
  },

  root: {
    marginLeft: 0,
  },
};

const getDeepItem = (data: any, path: (string | number)[]) =>
  path.reduce((obj, key) => obj && obj[key], data);
const dataIsEqual = (
  data: any,
  previousData: unknown,
  keyPath: (string | number)[],
) => {
  const path = [...keyPath].reverse().slice(1);

  return getDeepItem(data, path) === getDeepItem(previousData, path);
};

interface Props<S, A extends Action<string>> {
  theme: Base16Theme;
  select: (state: any) => unknown;
  action: A;
  actionId: number;
  state: S;
  previousState: S | undefined;
  collapsed: boolean;
  inFuture: boolean;
  selected: boolean;
  error: string | undefined;
  expandActionRoot: boolean;
  expandStateRoot: boolean;
  markStateDiff: boolean;
  onActionClick: (id: number) => void;
  onActionShiftClick: (id: number) => void;
}

export default class LogMonitorEntry<
  S,
  A extends Action<string>,
> extends PureComponent<Props<S, A>> {
  printState(state: S, error: string | undefined) {
    let errorText = error;
    if (!errorText) {
      try {
        const data = this.props.select(state);
        let theme;

        if (this.props.markStateDiff) {
          const previousData =
            typeof this.props.previousState !== 'undefined'
              ? this.props.select(this.props.previousState)
              : undefined;
          const getValueStyle: StylingValue = (
            { style },
            nodeType,
            keyPath,
          ) => ({
            style: {
              ...style,
              backgroundColor: dataIsEqual(
                data,
                previousData,
                keyPath as (string | number)[],
              )
                ? 'transparent'
                : this.props.theme.base01,
            },
          });
          const getNestedNodeStyle: StylingValue = ({ style }, keyPath) => ({
            style: {
              ...style,
              ...((keyPath as unknown[]).length > 1 ? {} : styles.root),
            },
          });
          theme = {
            extend: this.props.theme,
            value: getValueStyle,
            nestedNode: getNestedNodeStyle,
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
            shouldExpandNodeInitially={this.shouldExpandNodeInitially}
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
          paddingBottom: 35,
        }}
      >
        {errorText}
      </div>
    );
  }

  handleActionClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const { actionId, onActionClick, onActionShiftClick } = this.props;
    if (actionId > 0) {
      if (e.shiftKey) {
        onActionShiftClick(actionId);
      } else {
        onActionClick(actionId);
      }
    }
  };

  shouldExpandNodeInitially: ShouldExpandNodeInitially = (
    keyPath,
    data,
    level,
  ) => {
    return this.props.expandStateRoot && level === 0;
  };

  render() {
    const { actionId, error, action, state, collapsed, selected, inFuture } =
      this.props;
    const styleEntry = {
      opacity: collapsed ? 0.5 : 1,
      cursor: actionId > 0 ? 'pointer' : 'default',
    };

    return (
      <div
        style={{
          opacity: selected ? 0.4 : inFuture ? 0.6 : 1, // eslint-disable-line no-nested-ternary
          textDecoration: collapsed ? 'line-through' : 'none',
          color: this.props.theme.base06,
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
