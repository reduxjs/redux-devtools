import React, { Component } from 'react';
import type { Base16Theme } from 'react-base16-styling';
import { Action } from 'redux';
import type { LabelRenderer } from 'react-json-tree';
import { PerformAction } from '@redux-devtools/core';
import type { Delta } from 'jsondiffpatch';
import type { JSX } from '@emotion/react/jsx-runtime';
import { DEFAULT_STATE, DevtoolsInspectorState } from './redux';
import ActionPreviewHeader from './ActionPreviewHeader';
import DiffTab from './tabs/DiffTab';
import StateTab from './tabs/StateTab';
import ActionTab from './tabs/ActionTab';

export interface TabComponentProps<S, A extends Action<string>> {
  labelRenderer: LabelRenderer;
  computedStates: { state: S; error?: string }[];
  actions: { [actionId: number]: PerformAction<A> };
  selectedActionId: number | null;
  startActionId: number | null;
  base16Theme: Base16Theme;
  invertTheme: boolean;
  isWideLayout: boolean;
  sortStateTreeAlphabetically: boolean;
  disableStateTreeCollection: boolean;
  dataTypeKey: string | symbol | undefined;
  delta: Delta | null | undefined | false;
  action: A;
  nextState: S;
  monitorState: DevtoolsInspectorState;
  updateMonitorState: (monitorState: Partial<DevtoolsInspectorState>) => void;
}

export interface Tab<S, A extends Action<string>> {
  name: string;
  component: React.ComponentType<TabComponentProps<S, A>>;
}

const DEFAULT_TABS = [
  {
    name: 'Action',
    component: ActionTab,
  },
  {
    name: 'Diff',
    component: DiffTab,
  },
  {
    name: 'State',
    component: StateTab,
  },
];

interface Props<S, A extends Action<string>> {
  base16Theme: Base16Theme;
  invertTheme: boolean;
  isWideLayout: boolean;
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[]);
  tabName: string;
  delta: Delta | null | undefined | false;
  error: string | undefined;
  nextState: S;
  computedStates: { state: S; error?: string }[];
  action: A;
  actions: { [actionId: number]: PerformAction<A> };
  selectedActionId: number | null;
  startActionId: number | null;
  dataTypeKey: string | symbol | undefined;
  monitorState: DevtoolsInspectorState;
  updateMonitorState: (monitorState: Partial<DevtoolsInspectorState>) => void;
  onInspectPath: (path: (string | number)[]) => void;
  inspectedPath: (string | number)[];
  onSelectTab: (tabName: string) => void;
  sortStateTreeAlphabetically: boolean;
  disableStateTreeCollection: boolean;
}

class ActionPreview<S, A extends Action<string>> extends Component<
  Props<S, A>
> {
  static defaultProps = {
    tabName: DEFAULT_STATE.tabName,
  };

  render(): JSX.Element {
    const {
      delta,
      error,
      nextState,
      onInspectPath,
      inspectedPath,
      tabName,
      isWideLayout,
      onSelectTab,
      action,
      actions,
      selectedActionId,
      startActionId,
      computedStates,
      base16Theme,
      invertTheme,
      tabs,
      dataTypeKey,
      monitorState,
      updateMonitorState,
      sortStateTreeAlphabetically,
      disableStateTreeCollection,
    } = this.props;

    const renderedTabs: Tab<S, A>[] =
      typeof tabs === 'function'
        ? tabs(DEFAULT_TABS as Tab<S, A>[])
        : tabs
          ? tabs
          : (DEFAULT_TABS as Tab<S, A>[]);

    const { component: TabComponent } =
      renderedTabs.find((tab) => tab.name === tabName) ||
      renderedTabs.find((tab) => tab.name === DEFAULT_STATE.tabName)!;

    return (
      <div
        key="actionPreview"
        css={(theme) => ({
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflowY: 'hidden',

          '& pre': {
            border: 'inherit',
            borderRadius: '3px',
            lineHeight: 'inherit',
            color: 'inherit',
          },

          backgroundColor: theme.BACKGROUND_COLOR,
        })}
      >
        <ActionPreviewHeader
          tabs={renderedTabs as unknown as Tab<unknown, Action<string>>[]}
          {...{ inspectedPath, onInspectPath, tabName, onSelectTab }}
        />
        {!error && (
          <div key="actionPreviewContent" css={{ flex: 1, overflowY: 'auto' }}>
            <TabComponent
              labelRenderer={this.labelRenderer}
              {...{
                computedStates,
                actions,
                selectedActionId,
                startActionId,
                base16Theme,
                invertTheme,
                isWideLayout,
                sortStateTreeAlphabetically,
                disableStateTreeCollection,
                dataTypeKey,
                delta,
                action,
                nextState,
                monitorState,
                updateMonitorState,
              }}
            />
          </div>
        )}
        {error && (
          <div
            css={(theme) => ({
              padding: '10px',
              marginLeft: '14px',
              fontWeight: 'bold',

              color: theme.ERROR_COLOR,
            })}
          >
            {error}
          </div>
        )}
      </div>
    );
  }

  labelRenderer: LabelRenderer = ([key, ...rest], nodeType, expanded) => {
    const { onInspectPath, inspectedPath } = this.props;

    return (
      <span>
        <span>{key}</span>
        <span
          css={(theme) => ({
            fontSize: '0.7em',
            paddingLeft: '5px',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },

            color: theme.PIN_COLOR,
          })}
          onClick={() =>
            onInspectPath([
              ...inspectedPath.slice(0, inspectedPath.length - 1),
              ...[key, ...rest].reverse(),
            ])
          }
        >
          {'(pin)'}
        </span>
        {!expanded && ': '}
      </span>
    );
  };
}

export default ActionPreview;
