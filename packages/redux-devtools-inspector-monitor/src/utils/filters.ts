import type { Action } from 'redux';
import type { LiftedState, PerformAction } from '@redux-devtools/core';
import { ActionForm } from '../redux';

type ComputedStates<S> = LiftedState<
  S,
  Action<unknown>,
  unknown
>['computedStates'];

function isNoopAction<S>(
  actionId: number,
  computedStates: ComputedStates<S>
): boolean {
  return (
    actionId === 0 ||
    computedStates[actionId]?.state === computedStates[actionId - 1]?.state
  );
}

function filterStateChangingAction<S>(
  actionIds: number[],
  computedStates: ComputedStates<S>
): number[] {
  return actionIds.filter(
    (actionId) => !isNoopAction(actionId, computedStates)
  );
}

function filterActionsBySearchValue<A extends Action<unknown>>(
  searchValue: string | undefined,
  actionIds: number[],
  actions: Record<number, PerformAction<A>>
): number[] {
  const lowerSearchValue = searchValue && searchValue.toLowerCase();

  if (!lowerSearchValue) {
    return actionIds;
  }

  return actionIds.filter((id) => {
    const type = actions[id].action.type;

    return (
      type != null &&
      `${type as string}`.toLowerCase().includes(lowerSearchValue)
    );
  });
}

export interface FilterActionsPayload<S, A extends Action<unknown>> {
  readonly actionIds: number[];
  readonly actions: Record<number, PerformAction<A>>;
  readonly computedStates: ComputedStates<S>;
  readonly actionForm: ActionForm;
}

export function filterActions<S, A extends Action<unknown>>({
  actionIds,
  actions,
  computedStates,
  actionForm,
}: FilterActionsPayload<S, A>): number[] {
  let output = filterActionsBySearchValue(
    actionForm.searchValue,
    actionIds,
    actions
  );

  if (actionForm.isNoopFilterActive) {
    output = filterStateChangingAction(actionIds, computedStates);
  }

  return output;
}
