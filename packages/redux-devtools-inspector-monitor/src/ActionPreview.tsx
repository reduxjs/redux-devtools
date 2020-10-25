import React, { Component } from 'react';
import { Base16Theme } from 'redux-devtools-themes';
import { Action } from 'redux';
import { StylingFunction } from 'react-base16-styling';
import { PerformAction } from 'redux-devtools';
import { Delta } from 'jsondiffpatch';
import { DEFAULT_STATE, DevtoolsInspectorState } from './redux';
import ActionPreviewHeader from './ActionPreviewHeader';
import DiffTab from './tabs/DiffTab';
import StateTab from './tabs/StateTab';
import ActionTab from './tabs/ActionTab';

export interface TabComponentProps<S, A extends Action<unknown>> {
  labelRenderer: (
    keyPath: (string | number)[],
    nodeType: string,
    expanded: boolean,
    expandable: boolean
  ) => React.ReactNode;
  styling: StylingFunction;
  computedStates: { state: S; error?: string }[];
  actions: { [actionId: number]: PerformAction<A> };
  selectedActionId: number | null;
  startActionId: number | null;
  base16Theme: Base16Theme;
  invertTheme: boolean;
  isWideLayout: boolean;
  dataTypeKey: string | symbol | undefined;
  delta: Delta | null | undefined | false;
  action: A;
  nextState: S;
  monitorState: DevtoolsInspectorState;
  updateMonitorState: (monitorState: Partial<DevtoolsInspectorState>) => void;
}

export interface Tab<S, A extends Action<unknown>> {
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

interface Props<S, A extends Action<unknown>> {
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
  styling: StylingFunction;
  onInspectPath: (path: (string | number)[]) => void;
  inspectedPath: (string | number)[];
  onSelectTab: (tabName: string) => void;
}

class ActionPreview<S, A extends Action<unknown>> extends Component<
  Props<S, A>
> {
  static defaultProps = {
    tabName: DEFAULT_STATE.tabName,
  };

  render() {
    const {
      styling,
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
      <div key="actionPreview" {...styling('actionPreview')}>
        <ActionPreviewHeader
          tabs={(renderedTabs as unknown) as Tab<unknown, Action<unknown>>[]}
          {...{ styling, inspectedPath, onInspectPath, tabName, onSelectTab }}
        />
        {!error && (
          <div key="actionPreviewContent" {...styling('actionPreviewContent')}>
            <TabComponent
              labelRenderer={this.labelRenderer}
              {...{
                styling,
                computedStates,
                actions,
                selectedActionId,
                startActionId,
                base16Theme,
                invertTheme,
                isWideLayout,
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
        {error && <div {...styling('stateError')}>{error}</div>}
      </div>
    );
  }

  labelRenderer = (
    [key, ...rest]: (string | number)[],
    nodeType: string,
    expanded: boolean
  ) => {
    const { styling, onInspectPath, inspectedPath } = this.props;

    return (
      <span>
        <span {...styling('treeItemKey')}>{key}</span>
        <span
          {...styling('treeItemPin')}
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
