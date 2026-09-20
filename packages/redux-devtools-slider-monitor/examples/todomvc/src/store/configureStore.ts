import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

const configureStore: (
  initialState?: Partial<TodoState>,
) => Store<TodoState, TodoAction> =
  process.env.NODE_ENV === 'production'
    ? require('./configureStore.prod').default
    : require('./configureStore.dev').default;
export default configureStore;
