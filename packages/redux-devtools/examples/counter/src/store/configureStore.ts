import { Store } from 'redux';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';

const configureStore: (
  initialState?: Partial<CounterState>,
) => Store<CounterState, CounterAction> =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod').default
    : require('./configureStore.dev').default;
export default configureStore;
