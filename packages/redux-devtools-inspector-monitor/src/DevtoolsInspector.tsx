import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Base16Theme } from 'redux-devtools-themes';
import {
  getBase16Theme,
  invertTheme,
  StylingFunction,
} from 'react-base16-styling';
import {
  ActionCreators,
  LiftedAction,
  LiftedState,
} from '@redux-devtools/core';
import { Action, Dispatch } from 'redux';
import { Delta, DiffContext } from 'jsondiffpatch';
import {
  createStylingFromTheme,
  base16Themes,
} from './utils/createStylingFromTheme';
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

const {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  commit,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  sweep,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  toggleAction,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  jumpToAction,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  jumpToState,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  reorderAction,
} = ActionCreators;

function getLastActionId<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>
) {
  return props.stagedActionIds[props.stagedActionIds.length - 1];
}

function getCurrentActionId<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>,
  monitorState: DevtoolsInspectorState
) {
  return monitorState.selectedActionId === null
    ? props.stagedActionIds[props.currentStateIndex]
    : monitorState.selectedActionId;
}

function getFromState<S>(
  actionIndex: number,
  stagedActionIds: number[],
  computedStates: { state: S; error?: string }[],
  monitorState: DevtoolsInspectorState
) {
  const { startActionId } = monitorState;
  if (startActionId === null) {
    return actionIndex > 0 ? computedStates[actionIndex - 1] : null;
  }
  let fromStateIdx = stagedActionIds.indexOf(startActionId - 1);
  if (fromStateIdx === -1) fromStateIdx = 0;
  return computedStates[fromStateIdx];
}

function createIntermediateState<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>,
  monitorState: DevtoolsInspectorState
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
    error,
  };
}

function createThemeState<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>
) {
  const base16Theme = getBase16Theme(props.theme, base16Themes)!;

  const theme = props.invertTheme ? invertTheme(props.theme) : props.theme;
  const styling = createStylingFromTheme(theme);

  return { base16Theme, styling };
}

export interface ExternalProps<S, A extends Action<unknown>> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >;
  preserveScrollTop?: boolean;
  draggableActions: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
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
  theme: keyof typeof base16Themes;
  invertTheme: boolean;
}

export interface DevtoolsInspectorProps<S, A extends Action<unknown>>
  extends LiftedState<S, A, DevtoolsInspectorState> {
  dispatch: Dispatch<
    DevtoolsInspectorAction | LiftedAction<S, A, DevtoolsInspectorState>
  >;
  preserveScrollTop?: boolean;
  draggableActions: boolean;
  select: (state: S) => unknown;
  theme: keyof typeof base16Themes | Base16Theme;
  supportImmutable: boolean;
  diffObjectHash?: (item: unknown, index: number) => string;
  diffPropertyFilter?: (name: string, context: DiffContext) => boolean;
  hideMainButtons?: boolean;
  hideActionButtons?: boolean;
  sortStateTreeAlphabetically: boolean;
  disableStateTreeCollection: boolean;
  invertTheme: boolean;
  dataTypeKey?: string | symbol;
  tabs: Tab<S, A>[] | ((tabs: Tab<S, A>[]) => Tab<S, A>[]);
}

interface State<S, A extends Action<unknown>> {
  delta: Delta | null | undefined | false;
  nextState: S;
  action: A;
  error: string | undefined;
  isWideLayout: boolean;
  themeState: { base16Theme: Base16Theme; styling: StylingFunction };
}

class DevtoolsInspector<S, A extends Action<unknown>> extends PureComponent<
  DevtoolsInspectorProps<S, A>,
  State<S, A>
> {
  state: State<S, A> = {
    ...createIntermediateState(this.props, this.props.monitorState),
    isWideLayout: false,
    themeState: createThemeState(this.props),
  };

  static propTypes = {
    dispatch: PropTypes.func,
    computedStates: PropTypes.array,
    stagedActionIds: PropTypes.array,
    actionsById: PropTypes.object,
    currentStateIndex: PropTypes.number,
    monitorState: PropTypes.shape({
      initialScrollTop: PropTypes.number,
    }),
    preserveScrollTop: PropTypes.bool,
    draggableActions: PropTypes.bool,
    select: PropTypes.func.isRequired,
    theme: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    supportImmutable: PropTypes.bool,
    diffObjectHash: PropTypes.func,
    diffPropertyFilter: PropTypes.func,
    hideMainButtons: PropTypes.bool,
    hideActionButtons: PropTypes.bool,
    invertTheme: PropTypes.bool,
    sortStateTreeAlphabetically: PropTypes.bool,
    disableStateTreeCollection: PropTypes.bool,
    skippedActionIds: PropTypes.array,
    dataTypeKey: PropTypes.any,
    tabs: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
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
      150
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

    if (
      this.props.theme !== nextProps.theme ||
      this.props.invertTheme !== nextProps.invertTheme
    ) {
      this.setState({ themeState: createThemeState(nextProps) });
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
    const { themeState, isWideLayout, action, nextState, delta, error } =
      this.state;
    const { base16Theme, styling } = themeState;

    return (
      <div
        key="inspector"
        data-testid="inspector"
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
            styling,
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
          styling={styling}
          onInspectPath={(path: (string | number)[]) =>
            this.handleInspectPath(inspectedPathType, path)
          }
          inspectedPath={monitorState[inspectedPathType]}
          onSelectTab={this.handleSelectTab}
        />
      </div>
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
    actionId: number
  ) => {
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

  handleInspectPath = (
    pathType: 'inspectedActionPath' | 'inspectedStatePath',
    path: (string | number)[]
  ) => {
    this.updateMonitorState({ [pathType]: path });
  };

  handleSelectTab = (tabName: string) => {
    this.updateMonitorState({ tabName });
  };
}

export default DevtoolsInspector as unknown as React.ComponentType<
  ExternalProps<unknown, Action<unknown>>
> & {
  update(
    monitorProps: ExternalProps<unknown, Action<unknown>>,
    state: DevtoolsInspectorState | undefined,
    action: DevtoolsInspectorAction
  ): DevtoolsInspectorState;
  defaultProps: DefaultProps;
};
