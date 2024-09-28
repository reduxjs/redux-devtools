import { Action, Reducer, StoreEnhancer } from 'redux';
import { LiftedState } from '@redux-devtools/instrument';

export default function persistState<S, A extends Action<string>, MonitorState>(
  sessionId?: string | null,
  deserializeState: (state: S) => S = (state) => state,
  deserializeAction: (action: A) => A = (state) => state,
): StoreEnhancer {
  if (!sessionId) {
    return (next) =>
      (...args) =>
        next(...args);
  }

  function deserialize(
    state: LiftedState<S, A, MonitorState>,
  ): LiftedState<S, A, MonitorState> {
    return {
      ...state,
      actionsById: Object.fromEntries(
        Object.entries(state.actionsById).map(([actionId, liftedAction]) => [
          actionId,
          {
            ...liftedAction,
            action: deserializeAction(liftedAction.action),
          },
        ]),
      ),
      committedState: deserializeState(state.committedState),
      computedStates: state.computedStates.map((computedState) => ({
        ...computedState,
        state: deserializeState(computedState.state),
      })),
    };
  }

  return (next) =>
    <S2, A2 extends Action<string>, PreloadedState>(
      reducer: Reducer<S2, A2, PreloadedState>,
      initialState?: PreloadedState | undefined,
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
        finalInitialState as PreloadedState | undefined,
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
