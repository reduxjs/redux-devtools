import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';
import { ComponentType } from 'react';

interface Props {
  store: Store<TodoState, TodoAction>;
}
const Root: ComponentType<Props> =
  process.env.NODE_ENV === 'production'
    ? // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./Root.prod').default
    : // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('./Root.dev').default;
export default Root;
