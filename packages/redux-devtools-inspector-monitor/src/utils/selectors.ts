import { shallowEqual } from 'react-redux';
import { Action } from 'redux';
import type { LiftedState, PerformAction } from '@redux-devtools/core';
import { createSelectorCreator, defaultMemoize } from 'reselect';
import { DevtoolsInspectorState } from '../redux';
import { DevtoolsInspectorProps } from '../DevtoolsInspector';

/**
 * @see https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
 */
export const createShallowEqualSelector = createSelectorCreator(
  defaultMemoize,
  shallowEqual
);

type ComputedStates<S> = LiftedState<
  S,
  Action<unknown>,
  unknown
>['computedStates'];

export interface SelectorsSource<S, A extends Action<unknown>> {
  readonly actionIds: number[];
  readonly actions: Record<number, PerformAction<A>>;
  readonly computedStates: ComputedStates<S>;
  readonly monitorState: DevtoolsInspectorState;
  readonly currentStateIndex: number;
}

export function computeSelectorSource<S, A extends Action<unknown>>(
  props: DevtoolsInspectorProps<S, A>,
  previous: SelectorsSource<S, A> | null = null
): SelectorsSource<S, A> {
  const {
    computedStates,
    currentStateIndex,
    monitorState,
    stagedActionIds,
    actionsById,
  } = props;

  const next: SelectorsSource<S, A> = {
    currentStateIndex,
    monitorState,
    computedStates,
    actions: actionsById,
    actionIds: stagedActionIds,
  };

  if (previous && shallowEqual(next, previous)) {
    return previous;
  }

  return next;
}
