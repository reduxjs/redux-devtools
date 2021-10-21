import mapValues from 'lodash/mapValues';
import identity from 'lodash/identity';
import { Action, PreloadedState, Reducer, StoreEnhancer } from 'redux';
import { LiftedState } from '@redux-devtools/instrument';

export default function persistState<
  S,
  A extends Action<unknown>,
  MonitorState
>(
  sessionId?: string | null,
  deserializeState: (state: S) => S = identity,
  deserializeAction: (action: A) => A = identity
): StoreEnhancer {
  if (!sessionId) {
    return (next) =>
      (...args) =>
        next(...args);
  }

  function deserialize(
    state: LiftedState<S, A, MonitorState>
  ): LiftedState<S, A, MonitorState> {
    return {
      ...state,
      actionsById: mapValues(state.actionsById, (liftedAction) => ({
        ...liftedAction,
        action: deserializeAction(liftedAction.action),
      })),
      committedState: deserializeState(state.committedState),
      computedStates: state.computedStates.map((computedState) => ({
        ...computedState,
        state: deserializeState(computedState.state),
      })),
    };
  }

  return (next) =>
    <S2, A2 extends Action<unknown>>(
      reducer: Reducer<S2, A2>,
      initialState?: PreloadedState<S2>
    ) => {
      const key = `redux-dev-session-${sessionId}`;

      let finalInitialState;
      try {
        const json = localStorage.getItem(key);
        if (json) {
          finalInitialState =
            deserialize(JSON.parse(json) as LiftedState<S, A, MonitorState>) ||
            initialState;
          next(reducer, initialState);
        }
      } catch (e) {
        console.warn('Could not read debug session from localStorage:', e); // eslint-disable-line no-console
        try {
          localStorage.removeItem(key);
        } finally {
          finalInitialState = undefined;
        }
      }

      const store = next(
        reducer,
        finalInitialState as PreloadedState<S2> | undefined
      );

      return {
        ...store,
        dispatch<T extends A2>(action: T) {
          store.dispatch(action);

          try {
            localStorage.setItem(key, JSON.stringify(store.getState()));
          } catch (e) {
            console.warn('Could not write debug session to localStorage:', e); // eslint-disable-line no-console
          }

          return action;
        },
      };
    };
}
