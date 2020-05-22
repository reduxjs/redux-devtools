import React, { Component } from 'react';
import { DEFAULT_STATE, MonitorState } from './redux';
import ActionPreviewHeader from './ActionPreviewHeader';
import DiffTab from './tabs/DiffTab';
import StateTab from './tabs/StateTab';
import ActionTab from './tabs/ActionTab';
import { Base16Theme, StylingFunction } from 'react-base16-styling';
import { Delta } from 'jsondiffpatch';
import { Action } from 'redux';
import { PerformAction } from 'redux-devtools';

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
  dataTypeKey: string | undefined;
  delta: Delta | null | undefined | false;
  action: A;
  nextState: S;
  monitorState: MonitorState;
  updateMonitorState: (monitorState: Partial<MonitorState>) => void;
}

export interface Tab<S, A extends Action<unknown>> {
  name: string;
  component: React.ComponentType<TabComponentProps<S, A>>;
}

const DEFAULT_TABS = [
  {
    name: 'Action',
    component: ActionTab
  },
  {
    name: 'Diff',
    component: DiffTab
  },
  {
    name: 'State',
    component: StateTab
  }
];

interface Props<S, A extends Action<unknown>> {
  styling: StylingFunction;
  delta: Delta | null | undefined | false;
  error: string | undefined;
  nextState: S;
  onInspectPath: (path: (string | number)[]) => void;
  inspectedPath: (string | number)[];
  tabName: string;
  isWideLayout: boolean;
  onSelectTab: (tabName: string) => void;
  action: A;
  actions: { [actionId: number]: PerformAction<A> };
  selectedActionId: number | null;
  startActionId: number | null;
  computedStates: { state: S; error?: string }[];
  base16Theme: Base16Theme;
  invertTheme: boolean;
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[]);
  dataTypeKey: string | undefined;
  monitorState: MonitorState;
  updateMonitorState: (monitorState: Partial<MonitorState>) => void;
}

class ActionPreview<S, A extends Action<unknown>> extends Component<
  Props<S, A>
> {
  static defaultProps = {
    tabName: DEFAULT_STATE.tabName
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
      updateMonitorState
    } = this.props;

    const renderedTabs: Tab<S, A>[] =
      typeof tabs === 'function'
        ? tabs(DEFAULT_TABS as Tab<S, A>[])
        : tabs
        ? tabs
        : (DEFAULT_TABS as Tab<S, A>[]);

    const { component: TabComponent } =
      renderedTabs.find(tab => tab.name === tabName)! ||
      renderedTabs.find(tab => tab.name === DEFAULT_STATE.tabName)!;

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
                updateMonitorState
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
              ...[key, ...rest].reverse()
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
