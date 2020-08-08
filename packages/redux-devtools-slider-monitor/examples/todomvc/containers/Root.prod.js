import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import TodoApp from './TodoApp';

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <TodoApp />
    </div>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
