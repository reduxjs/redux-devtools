import React, { FunctionComponent } from 'react';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';
import { Store } from 'redux';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

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
