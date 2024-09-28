import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

const configureStore: (
  initialState?: Partial<TodoState>,
) => Store<TodoState, TodoAction> =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./configureStore.prod').default
    : // eslint-disable-next-line @typescript-eslint/no-require-imports
      require('./configureStore.dev').default;
export default configureStore;
