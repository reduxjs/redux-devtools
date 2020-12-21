import mapValues from 'lodash/mapValues';
import jsan from 'jsan';
import { immutableSerialize } from '@redux-devtools/serialize';
import { Action } from 'redux';
import Immutable from 'immutable';
import { State } from '../app/reducers/instances';

function deprecate(param: string) {
  // eslint-disable-next-line no-console
  console.warn(
    `\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead:` +
      ' https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1'
  );
}

export default function importState(
  state: string,
  {
    deserializeState,
    deserializeAction,
    serialize,
  }: {
    deserializeState?: (state: string) => unknown;
    deserializeAction?: (action: string) => Action<unknown>;
    serialize?: {
      immutable?: typeof Immutable;
      refs?: (new (data: any) => unknown)[] | null;
      reviver?: (key: string, value: unknown) => unknown;
    };
  }
) {
  if (!state) return undefined;
  let parse = jsan.parse;
  if (serialize) {
    if (serialize.immutable) {
      parse = (v) =>
        jsan.parse(
          v,
          immutableSerialize(serialize.immutable!, serialize.refs).reviver
        );
    } else if (serialize.reviver) {
      parse = (v) => jsan.parse(v, serialize.reviver);
    }
  }

  let preloadedState: State | undefined;
  let nextLiftedState: State = parse(state) as State;
  if (
    ((nextLiftedState as unknown) as {
      payload?: string;
      preloadedState?: string;
    }).payload
  ) {
    if (
      ((nextLiftedState as unknown) as {
        payload: string;
        preloadedState?: string;
      }).preloadedState
    )
      preloadedState = parse(
        ((nextLiftedState as unknown) as {
          payload: string;
          preloadedState: string;
        }).preloadedState
      ) as State;
    nextLiftedState = parse(
      ((nextLiftedState as unknown) as {
        payload: string;
      }).payload
    ) as State;
  }
  if (deserializeState) {
    deprecate('deserializeState');
    if (typeof nextLiftedState.computedStates !== 'undefined') {
      nextLiftedState.computedStates = nextLiftedState.computedStates.map(
        (computedState) => ({
          ...computedState,
          state: deserializeState(computedState.state as string),
        })
      );
    }
    if (typeof nextLiftedState.committedState !== 'undefined') {
      nextLiftedState.committedState = deserializeState(
        nextLiftedState.committedState as string
      );
    }
    if (typeof preloadedState !== 'undefined') {
      preloadedState = deserializeState(
        (preloadedState as unknown) as string
      ) as State;
    }
  }
  if (deserializeAction) {
    deprecate('deserializeAction');
    nextLiftedState.actionsById = mapValues(
      nextLiftedState.actionsById,
      (liftedAction) => ({
        ...liftedAction,
        action: deserializeAction((liftedAction.action as unknown) as string),
      })
    );
  }

  return { nextLiftedState, preloadedState };
}
