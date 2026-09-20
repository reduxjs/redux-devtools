import { Store } from 'redux';
import { ComponentType } from 'react';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? require('./Root.prod').default
    : require('./Root.dev').default;
export default Root;
