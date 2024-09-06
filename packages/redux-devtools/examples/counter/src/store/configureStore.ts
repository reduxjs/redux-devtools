import { Store } from 'redux';
import { CounterState } from '../reducers';
import { CounterAction } from '../actions/CounterActions';

const configureStore: (
  initialState?: Partial<CounterState>,
) => Store<CounterState, CounterAction> =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./configureStore.prod').default
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./configureStore.dev').default;
export default configureStore;
