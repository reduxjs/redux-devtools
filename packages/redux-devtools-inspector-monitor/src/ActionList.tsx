import React, { PureComponent, RefCallback } from 'react';
import { Drake } from 'dragula';
import dragula from 'react-dragula';
import { Action } from 'redux';
import { PerformAction } from '@redux-devtools/core';
import { StylingFunction } from 'react-base16-styling';
import ActionListRow from './ActionListRow';
import ActionListHeader from './ActionListHeader';

function getTimestamps<A extends Action<unknown>>(
  actions: { [actionId: number]: PerformAction<A> },
  actionIds: number[],
  actionId: number
) {
  const idx = actionIds.indexOf(actionId);
  const prevActionId = actionIds[idx - 1];

  return {
    current: actions[actionId].timestamp,
    previous: idx ? actions[prevActionId].timestamp : 0,
  };
}

interface Props<A extends Action<unknown>> {
  actions: { [actionId: number]: PerformAction<A> };
  actionIds: number[];
  isWideLayout: boolean;
  searchValue: string | undefined;
  selectedActionId: number | null;
  startActionId: number | null;
  skippedActionIds: number[];
  draggableActions: boolean;
  hideMainButtons: boolean | undefined;
  hideActionButtons: boolean | undefined;
  styling: StylingFunction;
  onSearch: (value: string) => void;
  onSelect: (e: React.MouseEvent<HTMLDivElement>, actionId: number) => void;
  onToggleAction: (actionId: number) => void;
  onJumpToState: (actionId: number) => void;
  onCommit: () => void;
  onSweep: () => void;
  onReorderAction: (actionId: number, beforeActionId: number) => void;
  currentActionId: number;
  lastActionId: number;
}

export default class ActionList<
  A extends Action<unknown>
> extends PureComponent<Props<A>> {
  node?: HTMLDivElement | null;
  scrollDown?: boolean;
  drake?: Drake;

  UNSAFE_componentWillReceiveProps(nextProps: Props<A>) {
    const node = this.node;
    if (!node) {
      this.scrollDown = true;
    } else if (this.props.lastActionId !== nextProps.lastActionId) {
      const { scrollTop, offsetHeight, scrollHeight } = node;
      this.scrollDown =
        Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 50;
    } else {
      this.scrollDown = false;
    }
  }

  componentDidMount() {
    this.scrollDown = true;
    this.scrollToBottom();

    if (!this.props.draggableActions) return;
    const container = this.node!;
    this.drake = dragula([container], {
      copy: false,
      copySortSource: false,
      mirrorContainer: container,
      accepts: (el, target, source, sibling) =>
        !sibling || !!parseInt(sibling.getAttribute('data-id')!),
      moves: (el, source, handle) =>
        !!parseInt(el!.getAttribute('data-id')!) &&
        handle!.className.indexOf('selectorButton') !== 0,
    }).on('drop', (el, target, source, sibling) => {
      let beforeActionId = this.props.actionIds.length;
      if (sibling && sibling.className.indexOf('gu-mirror') === -1) {
        beforeActionId = parseInt(sibling.getAttribute('data-id')!);
      }
      const actionId = parseInt(el.getAttribute('data-id')!);
      this.props.onReorderAction(actionId, beforeActionId);
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  scrollToBottom() {
    if (this.scrollDown && this.node) {
      this.node.scrollTop = this.node.scrollHeight;
    }
  }

  getRef: RefCallback<HTMLDivElement> = (node) => {
    this.node = node;
  };

  render() {
    const {
      styling,
      actions,
      actionIds,
      isWideLayout,
      onToggleAction,
      skippedActionIds,
      selectedActionId,
      startActionId,
      onSelect,
      onSearch,
      searchValue,
      currentActionId,
      hideMainButtons,
      hideActionButtons,
      onCommit,
      onSweep,
      onJumpToState,
    } = this.props;
    const lowerSearchValue = searchValue && searchValue.toLowerCase();
    const filteredActionIds = searchValue
      ? actionIds.filter(
          (id) =>
            (actions[id].action.type as string)
              .toLowerCase()
              .indexOf(lowerSearchValue as string) !== -1
        )
      : actionIds;

    return (
      <div
        key="actionList"
        data-testid="actionList"
        {...styling(
          ['actionList', isWideLayout && 'actionListWide'],
          isWideLayout
        )}
      >
        <ActionListHeader
          styling={styling}
          onSearch={onSearch}
          onCommit={onCommit}
          onSweep={onSweep}
          hideMainButtons={hideMainButtons}
          hasSkippedActions={skippedActionIds.length > 0}
          hasStagedActions={actionIds.length > 1}
          searchValue={searchValue}
        />
        <div
          data-testid="actionListRows"
          {...styling('actionListRows')}
          ref={this.getRef}
        >
          {filteredActionIds.map((actionId) => (
            <ActionListRow
              key={actionId}
              styling={styling}
              actionId={actionId}
              isInitAction={!actionId}
              isSelected={
                (startActionId !== null &&
                  actionId >= startActionId &&
                  actionId <= (selectedActionId as number)) ||
                actionId === selectedActionId
              }
              isInFuture={
                actionIds.indexOf(actionId) > actionIds.indexOf(currentActionId)
              }
              onSelect={(e: React.MouseEvent<HTMLDivElement>) =>
                onSelect(e, actionId)
              }
              timestamps={getTimestamps(actions, actionIds, actionId)}
              action={actions[actionId].action}
              onToggleClick={() => onToggleAction(actionId)}
              onJumpClick={() => onJumpToState(actionId)}
              onCommitClick={() => onCommit()}
              hideActionButtons={hideActionButtons}
              isSkipped={skippedActionIds.indexOf(actionId) !== -1}
            />
          ))}
        </div>
      </div>
    );
  }
}
