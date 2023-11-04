import jsan from 'jsan';
import { immutableSerialize } from '@redux-devtools/serialize';
import { Action } from 'redux';
import Immutable from 'immutable';
import { PerformAction } from '@redux-devtools/core';

interface State {
  actionsById: { [actionId: number]: PerformAction<Action<string>> };
  computedStates: { state: unknown; error?: string }[];
  committedState?: unknown;
}

export function importState(
  state: string,
  {
    serialize,
  }: {
    serialize?: {
      immutable?: typeof Immutable;
      refs?: (new (data: any) => unknown)[] | null;
      reviver?: (key: string, value: unknown) => unknown;
    };
  },
) {
  if (!state) return undefined;
  let parse = jsan.parse;
  if (serialize) {
    if (serialize.immutable) {
      parse = (v) =>
        jsan.parse(
          v,
          immutableSerialize(serialize.immutable!, serialize.refs).reviver,
        );
    } else if (serialize.reviver) {
      parse = (v) => jsan.parse(v, serialize.reviver);
    }
  }

  let preloadedState: State | undefined;
  let nextLiftedState: State = parse(state) as State;
  if (
    (
      nextLiftedState as unknown as {
        payload?: string;
        preloadedState?: string;
      }
    ).payload
  ) {
    if (
      (
        nextLiftedState as unknown as {
          payload: string;
          preloadedState?: string;
        }
      ).preloadedState
    )
      preloadedState = parse(
        (
          nextLiftedState as unknown as {
            payload: string;
            preloadedState: string;
          }
        ).preloadedState,
      ) as State;
    nextLiftedState = parse(
      (
        nextLiftedState as unknown as {
          payload: string;
        }
      ).payload,
    ) as State;
  }

  return { nextLiftedState, preloadedState };
}
