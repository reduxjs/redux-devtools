import mapValues from 'lodash/mapValues';
import jsan from 'jsan';
import seralizeImmutable from '@redux-devtools/serialize/lib/immutable/serialize';

function deprecate(param) {
  // eslint-disable-next-line no-console
  console.warn(
    `\`${param}\` parameter for Redux DevTools Extension is deprecated. Use \`serialize\` parameter instead: https://github.com/zalmoxisus/redux-devtools-extension/releases/tag/v2.12.1`
  );
}

export default function importState(
  state,
  { deserializeState, deserializeAction, serialize }
) {
  if (!state) return undefined;
  let parse = jsan.parse;
  if (serialize) {
    if (serialize.immutable) {
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
    } else if (serialize.reviver) {
      parse = (v) => jsan.parse(v, serialize.reviver);
    }
  }

  let preloadedState;
  let nextLiftedState = parse(state);
  if (nextLiftedState.payload) {
    if (nextLiftedState.preloadedState) {
      preloadedState = parse(nextLiftedState.preloadedState);
    }
    nextLiftedState = parse(nextLiftedState.payload);
  }
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
