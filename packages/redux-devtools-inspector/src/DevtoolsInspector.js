import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
  createStylingFromTheme,
  base16Themes
} from './utils/createStylingFromTheme';
import shouldPureComponentUpdate from 'react-pure-render/function';
import ActionList from './ActionList';
import ActionPreview from './ActionPreview';
import getInspectedState from './utils/getInspectedState';
import createDiffPatcher from './createDiffPatcher';
import { getBase16Theme } from 'react-base16-styling';
import { reducer, updateMonitorState } from './redux';
import { ActionCreators } from 'redux-devtools';

const {
  commit,
  sweep,
  toggleAction,
  jumpToAction,
  jumpToState,
  reorderAction
} = ActionCreators;

function getLastActionId(props) {
  return props.stagedActionIds[props.stagedActionIds.length - 1];
}

function getCurrentActionId(props, monitorState) {
  return monitorState.selectedActionId === null
    ? props.stagedActionIds[props.currentStateIndex]
    : monitorState.selectedActionId;
}

function getFromState(
  actionIndex,
  stagedActionIds,
  computedStates,
  monitorState
) {
  const { startActionId } = monitorState;
  if (startActionId === null) {
    return actionIndex > 0 ? computedStates[actionIndex - 1] : null;
  }
  let fromStateIdx = stagedActionIds.indexOf(startActionId - 1);
  if (fromStateIdx === -1) fromStateIdx = 0;
  return computedStates[fromStateIdx];
}

function createIntermediateState(props, monitorState) {
  const {
    supportImmutable,
    computedStates,
    stagedActionIds,
    actionsById: actions,
    diffObjectHash,
    diffPropertyFilter
  } = props;
  const { inspectedStatePath, inspectedActionPath } = monitorState;
  const currentActionId = getCurrentActionId(props, monitorState);
  const currentAction =
    actions[currentActionId] && actions[currentActionId].action;

  const actionIndex = stagedActionIds.indexOf(currentActionId);
  const fromState = getFromState(
    actionIndex,
    stagedActionIds,
    computedStates,
    monitorState
  );
  const toState = computedStates[actionIndex];
  const error = toState && toState.error;

  const fromInspectedState =
    !error &&
    fromState &&
    getInspectedState(fromState.state, inspectedStatePath, supportImmutable);
  const toInspectedState =
    !error &&
    toState &&
    getInspectedState(toState.state, inspectedStatePath, supportImmutable);
  const delta =
    !error &&
    fromState &&
    toState &&
    createDiffPatcher(diffObjectHash, diffPropertyFilter).diff(
      fromInspectedState,
      toInspectedState
    );

  return {
    delta,
    nextState:
      toState && getInspectedState(toState.state, inspectedStatePath, false),
    action: getInspectedState(currentAction, inspectedActionPath, false),
    error
  };
}

function createThemeState(props) {
  const base16Theme = getBase16Theme(props.theme, base16Themes);
  const styling = createStylingFromTheme(props.theme, props.invertTheme);

  return { base16Theme, styling };
}

export default class DevtoolsInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...createIntermediateState(props, props.monitorState),
      isWideLayout: false,
      themeState: createThemeState(props)
    };
  }

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    actionsById: PropTypes.object,
    currentStateIndex: PropTypes.number,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number
    }),
    preserveScrollTop: PropTypes.bool,
    draggableActions: PropTypes.bool,
    stagedActions: PropTypes.array,
    select: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    supportImmutable: PropTypes.bool,
    diffObjectHash: PropTypes.func,
    diffPropertyFilter: PropTypes.func,
    hideMainButtons: PropTypes.bool,
    hideActionButtons: PropTypes.bool,
    invertTheme: PropTypes.bool,
    skippedActionIds: PropTypes.array,
    dataTypeKey: PropTypes.any,
    tabs: PropTypes.oneOfType([PropTypes.array, PropTypes.func])
  };

  static update = reducer;

  static defaultProps = {
    select: state => state,
    supportImmutable: false,
    draggableActions: true,
    theme: 'inspector',
    invertTheme: true
  };

  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    this.updateSizeMode();
    this.updateSizeTimeout = setInterval(this.updateSizeMode.bind(this), 150);
  }

  componentWillUnmount() {
    clearTimeout(this.updateSizeTimeout);
  }

  updateMonitorState = monitorState => {
    this.props.dispatch(updateMonitorState(monitorState));
  };

  updateSizeMode() {
    const isWideLayout = this.inspectorRef.offsetWidth > 500;

    if (isWideLayout !== this.state.isWideLayout) {
      this.setState({ isWideLayout });
    }
  }

  componentWillReceiveProps(nextProps) {
    let nextMonitorState = nextProps.monitorState;
    const monitorState = this.props.monitorState;

    if (
      getCurrentActionId(this.props, monitorState) !==
        getCurrentActionId(nextProps, nextMonitorState) ||
      monitorState.startActionId !== nextMonitorState.startActionId ||
      monitorState.inspectedStatePath !== nextMonitorState.inspectedStatePath ||
      monitorState.inspectedActionPath !==
        nextMonitorState.inspectedActionPath ||
      this.props.computedStates !== nextProps.computedStates ||
      this.props.stagedActionIds !== nextProps.stagedActionIds
    ) {
      this.setState(createIntermediateState(nextProps, nextMonitorState));
    }

    if (
      this.props.theme !== nextProps.theme ||
      this.props.invertTheme !== nextProps.invertTheme
    ) {
      this.setState({ themeState: createThemeState(nextProps) });
    }
  }

  inspectorCreateRef = node => {
    this.inspectorRef = node;
  };

  render() {
    const {
      stagedActionIds: actionIds,
      actionsById: actions,
      computedStates,
      draggableActions,
      tabs,
      invertTheme,
      skippedActionIds,
      currentStateIndex,
      monitorState,
      dataTypeKey,
      hideMainButtons,
      hideActionButtons
    } = this.props;
    const {
      selectedActionId,
      startActionId,
      searchValue,
      tabName
    } = monitorState;
    const inspectedPathType =
      tabName === 'Action' ? 'inspectedActionPath' : 'inspectedStatePath';
    const {
      themeState,
      isWideLayout,
      action,
      nextState,
      delta,
      error
    } = this.state;
    const { base16Theme, styling } = themeState;

    return (
      <div
        key="inspector"
        ref={this.inspectorCreateRef}
        {...styling(
          ['inspector', isWideLayout && 'inspectorWide'],
          isWideLayout
        )}
      >
        <ActionList
          {...{
            actions,
            actionIds,
            isWideLayout,
            searchValue,
            selectedActionId,
            startActionId,
            skippedActionIds,
            draggableActions,
            hideMainButtons,
            hideActionButtons,
            styling
          }}
          onSearch={this.handleSearch}
          onSelect={this.handleSelectAction}
          onToggleAction={this.handleToggleAction}
          onJumpToState={this.handleJumpToState}
          onCommit={this.handleCommit}
          onSweep={this.handleSweep}
          onReorderAction={this.handleReorderAction}
          currentActionId={actionIds[currentStateIndex]}
          lastActionId={getLastActionId(this.props)}
        />
        <ActionPreview
          {...{
            base16Theme,
            invertTheme,
            isWideLayout,
            tabs,
            tabName,
            delta,
            error,
            nextState,
            computedStates,
            action,
            actions,
            selectedActionId,
            startActionId,
            dataTypeKey
          }}
          monitorState={this.props.monitorState}
          updateMonitorState={this.updateMonitorState}
          styling={styling}
          onInspectPath={this.handleInspectPath.bind(this, inspectedPathType)}
          inspectedPath={monitorState[inspectedPathType]}
          onSelectTab={this.handleSelectTab}
        />
      </div>
    );
  }

  handleToggleAction = actionId => {
    this.props.dispatch(toggleAction(actionId));
  };

  handleJumpToState = actionId => {
    if (jumpToAction) {
      this.props.dispatch(jumpToAction(actionId));
    } else {
      // Fallback for redux-devtools-instrument < 1.5
      const index = this.props.stagedActionIds.indexOf(actionId);
      if (index !== -1) this.props.dispatch(jumpToState(index));
    }
  };

  handleReorderAction = (actionId, beforeActionId) => {
    if (reorderAction)
      this.props.dispatch(reorderAction(actionId, beforeActionId));
  };

  handleCommit = () => {
    this.props.dispatch(commit());
  };

  handleSweep = () => {
    this.props.dispatch(sweep());
  };

  handleSearch = val => {
    this.updateMonitorState({ searchValue: val });
  };

  handleSelectAction = (e, actionId) => {
    const { monitorState } = this.props;
    let startActionId;
    let selectedActionId;

    if (e.shiftKey && monitorState.selectedActionId !== null) {
      if (monitorState.startActionId !== null) {
        if (actionId >= monitorState.startActionId) {
          startActionId = Math.min(
            monitorState.startActionId,
            monitorState.selectedActionId
          );
          selectedActionId = actionId;
        } else {
          selectedActionId = Math.max(
            monitorState.startActionId,
            monitorState.selectedActionId
          );
          startActionId = actionId;
        }
      } else {
        startActionId = Math.min(actionId, monitorState.selectedActionId);
        selectedActionId = Math.max(actionId, monitorState.selectedActionId);
      }
    } else {
      startActionId = null;
      if (
        actionId === monitorState.selectedActionId ||
        monitorState.startActionId !== null
      ) {
        selectedActionId = null;
      } else {
        selectedActionId = actionId;
      }
    }

    this.updateMonitorState({ startActionId, selectedActionId });
  };

  handleInspectPath = (pathType, path) => {
    this.updateMonitorState({ [pathType]: path });
  };

  handleSelectTab = tabName => {
    this.updateMonitorState({ tabName });
  };
}
