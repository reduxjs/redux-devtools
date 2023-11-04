import { instrument, Options } from '@redux-devtools/instrument';
import { Action, Reducer, StoreEnhancerStoreCreator } from 'redux';

export default function configureStore<
  S,
  A extends Action<string>,
  MonitorState,
  MonitorAction extends Action<string>,
>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: StoreEnhancerStoreCreator<{}, unknown>,
  subscriber: Reducer<MonitorState, MonitorAction>,
  options: Options<S, A, MonitorState, MonitorAction>,
) {
  return instrument(subscriber, options)(next);
}
