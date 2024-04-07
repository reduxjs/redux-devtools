import React, { PureComponent } from 'react';
import type { Base16Theme } from 'react-base16-styling';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import { Action, Dispatch } from 'redux';
import type { Delta, DiffContext } from 'jsondiffpatch';
import {
  createInspectorMonitorThemeFromBase16Theme,
  resolveBase16Theme,
} from './utils/themes';
import type { Base16ThemeName } from './utils/themes';
import ActionList from './ActionList';
import ActionPreview, { Tab } from './ActionPreview';
import getInspectedState from './utils/getInspectedState';
import createDiffPatcher from './createDiffPatcher';
import {
  DevtoolsInspectorAction,
  DevtoolsInspectorState,
  reducer,
  updateMonitorState,
} from './redux';
import { ThemeProvider } from '@emotion/react';

const {
  commit,
  sweep,
  toggleAction,
  jumpToAction,
  jumpToState,
  reorderAction,
} = ActionCreators;

function getLastActionId<S, A extends Action<string>>(
  props: DevtoolsInspectorProps<S, A>,
) {
  return props.stagedActionIds[props.stagedActionIds.length - 1];
}

function getCurrentActionId<S, A extends Action<string>>(
  props: DevtoolsInspectorProps<S, A>,
  monitorState: DevtoolsInspectorState,
) {
  return monitorState.selectedActionId === null
    ? props.stagedActionIds[props.currentStateIndex]
    : monitorState.selectedActionId;
}

function getFromState<S>(
  actionIndex: number,
  stagedActionIds: number[],
  computedStates: { state: S; error?: string }[],
  monitorState: DevtoolsInspectorState,
) {
  const { startActionId } = monitorState;
  if (startActionId === null) {
    return actionIndex > 0 ? computedStates[actionIndex - 1] : null;
  }
  let fromStateIdx = stagedActionIds.indexOf(startActionId - 1);
  if (fromStateIdx === -1) fromStateIdx = 0;
  return computedStates[fromStateIdx];
}

function createIntermediateState<S, A extends Action<string>>(
  props: DevtoolsInspectorProps<S, A>,
  monitorState: DevtoolsInspectorState,
) {
  const {
    supportImmutable,
    computedStates,
    stagedActionIds,
    actionsById: actions,
    diffObjectHash,
    diffPropertyFilter,
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
    monitorState,
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
      toInspectedState,
    );

  return {
    delta,
    nextState:
      toState && getInspectedState(toState.state, inspectedStatePath, false),
    action: getInspectedState(currentAction, inspectedActionPath, false),
    error,
  };
}

export interface ExternalProps<S, A extends Action<string>> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >;
  preserveScrollTop?: boolean;
  draggableActions: boolean;
  select: (state: S) => unknown;
  theme: Base16ThemeName | Base16Theme;
  supportImmutable: boolean;
  diffObjectHash?: (item: unknown, index: number) => string;
  diffPropertyFilter?: (name: string, context: DiffContext) => boolean;
  hideMainButtons?: boolean;
  hideActionButtons?: boolean;
  invertTheme: boolean;
  sortStateTreeAlphabetically: boolean;
  disableStateTreeCollection: boolean;
  dataTypeKey?: string | symbol;
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[]);
}

interface DefaultProps {
  select: (state: unknown) => unknown;
  supportImmutable: boolean;
  draggableActions: boolean;
  theme: Base16ThemeName;
  invertTheme: boolean;
}

export interface DevtoolsInspectorProps<S, A extends Action<string>>
  extends LiftedState<S, A, DevtoolsInspectorState> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >;
  preserveScrollTop?: boolean;
  draggableActions: boolean;
  select: (state: S) => unknown;
  theme: Base16ThemeName | Base16Theme;
  supportImmutable: boolean;
  diffObjectHash?: (item: unknown, index: number | undefined) => string;
  diffPropertyFilter?: (name: string, context: DiffContext) => boolean;
  hideMainButtons?: boolean;
  hideActionButtons?: boolean;
  sortStateTreeAlphabetically: boolean;
  disableStateTreeCollection: boolean;
  invertTheme: boolean;
  dataTypeKey?: string | symbol;
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[]);
}

interface State<S, A extends Action<string>> {
  delta: Delta | null | undefined | false;
  nextState: S;
  action: A;
  error: string | undefined;
  isWideLayout: boolean;
}

class DevtoolsInspector<S, A extends Action<string>> extends PureComponent<
  DevtoolsInspectorProps<S, A>,
  State<S, A>
> {
  state: State<S, A> = {
    ...createIntermediateState(this.props, this.props.monitorState),
    isWideLayout: false,
  };

  static update = reducer;

  static defaultProps = {
    select: (state: unknown) => state,
    supportImmutable: false,
    draggableActions: true,
    theme: 'inspector',
    invertTheme: true,
  };

  updateSizeTimeout?: number;
  inspectorRef?: HTMLDivElement | null;

  componentDidMount() {
    this.updateSizeMode();
    this.updateSizeTimeout = window.setInterval(
      this.updateSizeMode.bind(this),
      150,
    );
  }

  componentWillUnmount() {
    clearTimeout(this.updateSizeTimeout);
  }

  updateMonitorState = (monitorState: Partial<DevtoolsInspectorState>) => {
    this.props.dispatch(updateMonitorState(monitorState));
  };

  updateSizeMode() {
    const isWideLayout = this.inspectorRef!.offsetWidth > 500;

    if (isWideLayout !== this.state.isWideLayout) {
      this.setState({ isWideLayout });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: DevtoolsInspectorProps<S, A>) {
    const nextMonitorState = nextProps.monitorState;
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
  }

  inspectorCreateRef: React.RefCallback<HTMLDivElement> = (node) => {
    this.inspectorRef = node;
  };

  render() {
    const {
      stagedActionIds: actionIds,
      actionsById: actions,
      computedStates,
      draggableActions,
      tabs,
      theme,
      invertTheme,
      skippedActionIds,
      currentStateIndex,
      monitorState,
      dataTypeKey,
      hideMainButtons,
      hideActionButtons,
      sortStateTreeAlphabetically,
      disableStateTreeCollection,
    } = this.props;
    const { selectedActionId, startActionId, searchValue, tabName } =
      monitorState;
    const inspectedPathType =
      tabName === 'Action' ? 'inspectedActionPath' : 'inspectedStatePath';
    const { isWideLayout, action, nextState, delta, error } = this.state;

    const base16Theme = resolveBase16Theme(theme)!;
    const inspectorMonitorTheme = createInspectorMonitorThemeFromBase16Theme(
      base16Theme,
      invertTheme,
    );
    return (
      <ThemeProvider theme={inspectorMonitorTheme}>
        <div
          key="inspector"
          data-testid="inspector"
          ref={this.inspectorCreateRef}
          css={[
            (theme) => ({
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
              fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
              fontSize: '12px',
              WebkitFontSmoothing: 'antialiased',
              lineHeight: '1.5em',

              backgroundColor: theme.BACKGROUND_COLOR,
              color: theme.TEXT_COLOR,
            }),
            isWideLayout && { flexDirection: 'row' },
          ]}
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
              dataTypeKey,
              sortStateTreeAlphabetically,
              disableStateTreeCollection,
            }}
            monitorState={this.props.monitorState}
            updateMonitorState={this.updateMonitorState}
            onInspectPath={(path: (string | number)[]) =>
              this.handleInspectPath(inspectedPathType, path)
            }
            inspectedPath={monitorState[inspectedPathType]}
            onSelectTab={this.handleSelectTab}
          />
        </div>
      </ThemeProvider>
    );
  }

  handleToggleAction = (actionId: number) => {
    this.props.dispatch(toggleAction(actionId));
  };

  handleJumpToState = (actionId: number) => {
    if (jumpToAction) {
      this.props.dispatch(jumpToAction(actionId));
    } else {
      // Fallback for redux-devtools-instrument < 1.5
      const index = this.props.stagedActionIds.indexOf(actionId);
      if (index !== -1) this.props.dispatch(jumpToState(index));
    }
  };

  handleReorderAction = (actionId: number, beforeActionId: number) => {
    if (reorderAction)
      this.props.dispatch(reorderAction(actionId, beforeActionId));
  };

  handleCommit = () => {
    this.props.dispatch(commit());
  };

  handleSweep = () => {
    this.props.dispatch(sweep());
  };

  handleSearch = (val: string) => {
    this.updateMonitorState({ searchValue: val });
  };

  handleSelectAction = (
    e: React.MouseEvent<HTMLDivElement>,
    actionId: number,
  ) => {
    const { monitorState } = this.props;
    let startActionId;
    let selectedActionId;

    if (e.shiftKey && monitorState.selectedActionId !== null) {
      if (monitorState.startActionId !== null) {
        if (actionId >= monitorState.startActionId) {
          startActionId = Math.min(
            monitorState.startActionId,
            monitorState.selectedActionId,
          );
          selectedActionId = actionId;
        } else {
          selectedActionId = Math.max(
            monitorState.startActionId,
            monitorState.selectedActionId,
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

  handleInspectPath = (
    pathType: 'inspectedActionPath' | 'inspectedStatePath',
    path: (string | number)[],
  ) => {
    this.updateMonitorState({ [pathType]: path });
  };

  handleSelectTab = (tabName: string) => {
    this.updateMonitorState({ tabName });
  };
}

export default DevtoolsInspector as unknown as React.ComponentType<
  ExternalProps<unknown, Action<string>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<string>>,
    state: DevtoolsInspectorState | undefined,
    action: DevtoolsInspectorAction,
  ): DevtoolsInspectorState;
  defaultProps: DefaultProps;
};
