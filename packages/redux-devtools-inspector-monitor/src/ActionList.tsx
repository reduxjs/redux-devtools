import React, { ReactNode, useCallback, useLayoutEffect, useRef } from 'react';
import { Action } from 'redux';
import { PerformAction } from '@redux-devtools/core';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToFirstScrollableAncestor } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { JSX } from '@emotion/react/jsx-runtime';
import ActionListRow from './ActionListRow';
import ActionListHeader from './ActionListHeader';

function getTimestamps<A extends Action<string>>(
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

function scrollToBottom(node: HTMLDivElement) {
  node.scrollTop = node.scrollHeight;
}

interface Props<A extends Action<string>> {
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

export default function ActionList<A extends Action<string>>({
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
  onReorderAction,
}: Props<A>): JSX.Element {
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (over && active.id !== over.id) {
        const activeIndex = actionIds.indexOf(active.id as number);
        const overIndex = actionIds.indexOf(over.id as number);

        const beforeActionId =
          overIndex < activeIndex
            ? (over.id as number)
            : overIndex < actionIds.length - 1
              ? actionIds[overIndex + 1]
              : actionIds.length;

        onReorderAction(active.id as number, beforeActionId);
      }
    },
    [actionIds, onReorderAction],
  );

  const lowerSearchValue = searchValue && searchValue.toLowerCase();
  const filteredActionIds = searchValue
    ? actionIds.filter((id) =>
        actions[id].action.type
          .toLowerCase()
          .includes(lowerSearchValue as string),
      )
    : actionIds;

  return (
    <div
      key="actionList"
      data-testid="actionList"
      css={[
        (theme) => ({
          flexBasis: '40%',
          flexShrink: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          borderBottomWidth: '3px',
          borderBottomStyle: 'double',
          display: 'flex',
          flexDirection: 'column',

          backgroundColor: theme.BACKGROUND_COLOR,
          borderColor: theme.LIST_BORDER_COLOR,
        }),
        isWideLayout && {
          flexBasis: '40%',
          borderBottom: 'none',
          borderRightWidth: '3px',
          borderRightStyle: 'double',
        },
      ]}
    >
      <ActionListHeader
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
        css={{ overflow: 'auto' }}
        ref={setNodeRef}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToFirstScrollableAncestor]}
        >
          <SortableContext
            items={filteredActionIds}
            strategy={verticalListSortingStrategy}
          >
            {filteredActionIds.map((actionId) => (
              <SortableItem key={actionId} actionId={actionId}>
                <ActionListRow
                  actionId={actionId}
                  isInitAction={!actionId}
                  isSelected={
                    (startActionId !== null &&
                      actionId >= startActionId &&
                      actionId <= (selectedActionId as number)) ||
                    actionId === selectedActionId
                  }
                  isInFuture={
                    actionIds.indexOf(actionId) >
                    actionIds.indexOf(currentActionId)
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
                  isSkipped={skippedActionIds.includes(actionId)}
                />
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

interface SortableItemProps {
  readonly children: ReactNode;
  readonly actionId: number;
}

function SortableItem({ children, actionId }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: actionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}
