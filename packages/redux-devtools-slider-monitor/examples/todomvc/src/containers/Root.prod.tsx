import type { FunctionComponent } from 'react';
import React from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import type { Store } from 'redux';
import type { TodoState } from '../reducers';
import type { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}

const Root: FunctionComponent<Props> = ({ store }) => (
  <Provider store={store}>
    <div>
      <TodoApp />
    </div>
  </Provider>
);

export default Root;
