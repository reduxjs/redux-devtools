import {
  Action,
  createStore,
  PreloadedState,
  Reducer,
  StoreEnhancer,
} from 'redux';

export default function configureStore<S, A extends Action<unknown>>(
  reducer: Reducer<S, A>,
  initialState: PreloadedState<S> | undefined,
  enhance: () => StoreEnhancer
) {
  return createStore(reducer, initialState, enhance());
}
