import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { Action } from 'redux';
import { PerformAction } from '@redux-devtools/core';
import { StylingFunction } from 'react-base16-styling';
import ActionListRow from './ActionListRow';
import ActionListHeader from './ActionListHeader';

function getTimestamps<A extends Action<unknown>>(
  actions: { [actionId: number]: PerformAction<A> },
  actionIds: number[],
  actionId: number,
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

function scrollToBottom(node: HTMLDivElement) {
  node.scrollTop = node.scrollHeight;
}

export default function ActionListFunction<A extends Action<unknown>>({
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
  lastActionId,
}: Props<A>) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const prevLastActionId = useRef<number | undefined>();

  useLayoutEffect(() => {
    if (nodeRef.current && prevLastActionId.current !== lastActionId) {
      const { scrollTop, offsetHeight, scrollHeight } = nodeRef.current;
      if (Math.abs(scrollHeight - (scrollTop + offsetHeight)) < 50) {
        scrollToBottom(nodeRef.current);
      }
    }

    prevLastActionId.current = lastActionId;
  }, [lastActionId]);

  const setNodeRef = useCallback((node: HTMLDivElement | null) => {
    if (node && !nodeRef.current) {
      scrollToBottom(node);
    }

    nodeRef.current = node;
  }, []);

  const lowerSearchValue = searchValue && searchValue.toLowerCase();
  const filteredActionIds = searchValue
    ? actionIds.filter(
        (id) =>
          (actions[id].action.type as string)
            .toLowerCase()
            .indexOf(lowerSearchValue as string) !== -1,
      )
    : actionIds;

  return (
    <div
      key="actionList"
      data-testid="actionList"
      {...styling(
        ['actionList', isWideLayout && 'actionListWide'],
        isWideLayout,
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
        ref={setNodeRef}
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
