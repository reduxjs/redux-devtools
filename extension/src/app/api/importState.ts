import mapValues from 'lodash/mapValues';
import jsan from 'jsan';
import seralizeImmutable from '@redux-devtools/serialize/lib/immutable/serialize';
import {
  Config,
  SerializeWithImmutable,
} from '../../browser/extension/inject/pageScript';
import Immutable from 'immutable';
import { LiftedState } from '@redux-devtools/instrument';
import { Action } from 'redux';

function deprecate(param: string) {
  // eslint-disable-next-line no-console
  console.warn(
    `\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead: https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1`
  );
}

interface SerializeWithRequiredImmutable extends SerializeWithImmutable {
  readonly immutable: typeof Immutable;
}

function isSerializeWithImmutable(
  serialize: boolean | SerializeWithImmutable
): serialize is SerializeWithRequiredImmutable {
  return !!(serialize as SerializeWithImmutable).immutable;
}

interface SerializeWithRequiredReviver extends SerializeWithImmutable {
  readonly reviver: (key: string, value: unknown) => unknown;
}

function isSerializeWithReviver(
  serialize: boolean | SerializeWithImmutable
): serialize is SerializeWithRequiredReviver {
  return !!(serialize as SerializeWithImmutable).immutable;
}

interface ParsedSerializedLiftedState {
  readonly payload: string;
  readonly preloadedState?: string;
}

export default function importState<S, A extends Action<unknown>>(
  state: string | undefined,
  { deserializeState, deserializeAction, serialize }: Config
) {
  if (!state) return undefined;
  let parse = jsan.parse;
  if (serialize) {
    if (isSerializeWithImmutable(serialize)) {
      parse = (v) =>
        jsan.parse(
          v,
          seralizeImmutable(
            serialize.immutable,
            serialize.refs,
            serialize.replacer,
            serialize.reviver
          ).reviver
        );
    } else if (isSerializeWithReviver(serialize)) {
      parse = (v) => jsan.parse(v, serialize.reviver);
    }
  }

  const parsedSerializedLiftedState:
    | ParsedSerializedLiftedState
    | LiftedState<S, A, unknown> = parse(state) as
    | ParsedSerializedLiftedState
    | LiftedState<S, A, unknown>;
  let preloadedState =
    'payload' in parsedSerializedLiftedState &&
    parsedSerializedLiftedState.preloadedState
      ? (parse(parsedSerializedLiftedState.preloadedState) as S)
      : undefined;
  const nextLiftedState =
    'payload' in parsedSerializedLiftedState
      ? (parse(parsedSerializedLiftedState.payload) as LiftedState<
          S,
          A,
          unknown
        >)
      : parsedSerializedLiftedState;
  if (deserializeState) {
    deprecate('deserializeState');
    if (typeof nextLiftedState.computedStates !== 'undefined') {
      nextLiftedState.computedStates = nextLiftedState.computedStates.map(
        (computedState) => ({
          ...computedState,
          state: deserializeState(computedState.state),
        })
      );
    }
    if (typeof nextLiftedState.committedState !== 'undefined') {
      nextLiftedState.committedState = deserializeState(
        nextLiftedState.committedState
      );
    }
    if (typeof preloadedState !== 'undefined') {
      preloadedState = deserializeState(preloadedState);
    }
  }
  if (deserializeAction) {
    deprecate('deserializeAction');
    nextLiftedState.actionsById = mapValues(
      nextLiftedState.actionsById,
      (liftedAction) => ({
        ...liftedAction,
        action: deserializeAction(liftedAction.action),
      })
    );
  }

  return { nextLiftedState, preloadedState };
}
