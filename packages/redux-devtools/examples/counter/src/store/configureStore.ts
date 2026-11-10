import type { Store } from 'redux';
import type { CounterState } from '../reducers';
import type { CounterAction } from '../actions/CounterActions';

const configureStore: (
  initialState?: Partial<CounterState>,
) => Store<CounterState, CounterAction> =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod').default
    : require('./configureStore.dev').default;
export default configureStore;
