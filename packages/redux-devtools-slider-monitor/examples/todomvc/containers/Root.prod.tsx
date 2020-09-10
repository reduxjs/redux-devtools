import { hot } from 'react-hot-loader/root';
import React, { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
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

Root.propTypes = {
  store: PropTypes.any.isRequired,
};

export default hot(Root);
