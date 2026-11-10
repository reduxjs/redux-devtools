import type { Store } from 'redux';
import type { TodoState } from '../reducers';
import type { TodoAction } from '../actions/TodoActions';

const configureStore: (
  initialState?: Partial<TodoState>,
) => Store<TodoState, TodoAction> =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod').default
    : require('./configureStore.dev').default;
export default configureStore;
