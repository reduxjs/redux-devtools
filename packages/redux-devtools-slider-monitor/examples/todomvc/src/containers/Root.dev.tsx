import React from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import TodoApp from './TodoApp';
import DevTools from './DevTools';
import { TodoState } from '../reducers';
import { TodoAction } from '../actions/TodoActions';

interface Props {
  store: Store<TodoState, TodoAction>;
}

const Root: React.FunctionComponent<Props> = ({ store }) => (
  <Provider store={store}>
    <div>
      <TodoApp />
      <DevTools />
    </div>
  </Provider>
);

export default Root;
