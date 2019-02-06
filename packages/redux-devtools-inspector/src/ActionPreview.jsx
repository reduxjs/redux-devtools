import React, { Component } from 'react';
import { DEFAULT_STATE } from './redux';
import ActionPreviewHeader from './ActionPreviewHeader';
import DiffTab from './tabs/DiffTab';
import StateTab from './tabs/StateTab';
import ActionTab from './tabs/ActionTab';

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

class ActionPreview extends Component {
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

    const renderedTabs =
      typeof tabs === 'function'
        ? tabs(DEFAULT_TABS)
        : tabs
        ? tabs
        : DEFAULT_TABS;

    const { component: TabComponent } =
      renderedTabs.find(tab => tab.name === tabName) ||
      renderedTabs.find(tab => tab.name === DEFAULT_STATE.tabName);

    return (
      <div key="actionPreview" {...styling('actionPreview')}>
        <ActionPreviewHeader
          tabs={renderedTabs}
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

  labelRenderer = ([key, ...rest], nodeType, expanded) => {
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
