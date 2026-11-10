import type { Store } from 'redux';
import type { ComponentType } from 'react';
import type { TodoState } from '../reducers';
import type { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? require('./Root.prod').default
    : require('./Root.dev').default;
export default Root;
