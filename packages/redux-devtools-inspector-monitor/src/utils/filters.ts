import type { Action } from 'redux';
import type { LiftedState, PerformAction } from '@redux-devtools/core';
import { ActionForm } from '../redux';
import { makeSelectRtkQueryActionRegex } from './rtk-query';
import { createShallowEqualSelector, SelectorsSource } from './selectors';

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

  if (!lowerSearchValue || !actionIds.length) {
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

function filterOutRtkQueryActions(
  actionIds: number[],
  actions: Record<number, PerformAction<Action<unknown>>>,
  rtkQueryRegex: RegExp | null
) {
  if (!rtkQueryRegex || actionIds.length === 0) {
    return actionIds;
  }

  return actionIds.filter((actionId) => {
    const type = actions[actionId].action.type;

    return typeof type !== 'string' || !rtkQueryRegex.test(type);
  });
}
export interface FilterActionsPayload<S, A extends Action<unknown>> {
  readonly actionIds: number[];
  readonly actions: Record<number, PerformAction<A>>;
  readonly computedStates: ComputedStates<S>;
  readonly actionForm: ActionForm;
  readonly rtkQueryRegex: RegExp | null;
}

function filterActions<S, A extends Action<unknown>>({
  actionIds,
  actions,
  computedStates,
  actionForm,
  rtkQueryRegex,
}: FilterActionsPayload<S, A>): number[] {
  let output = filterActionsBySearchValue(
    actionForm.searchValue,
    actionIds,
    actions
  );

  if (actionForm.isNoopFilterActive) {
    output = filterStateChangingAction(output, computedStates);
  }

  if (actionForm.isRtkQueryFilterActive && rtkQueryRegex) {
    output = filterOutRtkQueryActions(output, actions, rtkQueryRegex);
  }

  return output;
}

export interface SelectFilteredActions<S, A extends Action<unknown>> {
  (selectorsSource: SelectorsSource<S, A>): number[];
}

/**
 * Creates a selector that given `SelectorsSource` returns
 * a list of filtered `actionsIds`.
 * @returns {number[]}
 */
export function makeSelectFilteredActions<
  S,
  A extends Action<unknown>
>(): SelectFilteredActions<S, A> {
  const selectRegex = makeSelectRtkQueryActionRegex();

  return createShallowEqualSelector(
    (selectorsSource: SelectorsSource<S, A>): FilterActionsPayload<S, A> => {
      const actionForm = selectorsSource.monitorState.actionForm;
      const { actionIds, actions, computedStates } = selectorsSource;

      return {
        actionIds,
        actions,
        computedStates,
        actionForm,
        rtkQueryRegex: selectRegex(selectorsSource),
      };
    },
    filterActions
  );
}
