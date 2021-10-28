import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { Route, Link } from 'react-router';
import * as TodoActions from '../actions/todos';

function mapDispatchToProps(dispatch) {
  return {
    pushState: bindActionCreators(pushState, dispatch),
    actions: bindActionCreators(TodoActions, dispatch),
  };
}

@connect((state) => ({}), mapDispatchToProps)
class Wrapper extends Component {
  static propTypes = {
    children: PropTypes.node,
  };

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const { actions, pushState } = this.props;
    const path = event.target.innerText;

    pushState(null, path);
    console.log('Navigate to', path);

    if (this.timeout) clearInterval(this.timeout);
    if (path === 'AutoTodo') {
      console.log('!');
      this.timeout = setInterval(() => {
        actions.addTodo('Auto generated task');
      }, 100);
    }
  }

  render() {
    return (
      <div>
        <div
          style={{
            padding: 20,
            backgroundColor: '#eee',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <a href="#" onClick={this.handleClick}>
            Standard Todo
          </a>{' '}
          |{' '}
          <a href="#" onClick={this.handleClick}>
            AutoTodo
          </a>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Wrapper;
