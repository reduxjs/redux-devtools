import React from 'react';
import { connect } from 'react-redux';
import pkg from '../../../package.json';
import { Button, Toolbar, Spacer } from 'devui';
import getOptions from './getOptions';
import { push as pushRoute } from 'react-router-redux';

const styles = {
  wrapper: {
    height: '100vh',
    width: '450px',
    margin: 'auto',
    textAlign: 'center'
  },
  muted: {
    color: '#CCCCCC'
  },
  link: {
    margin: '0 0.5rem',
    cursor: 'pointer',
    display: 'block'
  }
};

const ROOT = '/'; // process.env.NODE_ENV === 'production' ? '/' : '/';

function buildUrl(options) {
  return `${ROOT}?` + [
    options.useExtension ? 'ext' : '',
    options.theme ? 'theme=' + options.theme : '',
    options.dark ? 'dark' : ''
  ].filter(s => s).join('&');
}

class DemoApp extends React.Component {
  render() {
    const options = getOptions();

    return (
      <div style={styles.wrapper}>
        <h3>
          {pkg.name || <span style={styles.muted}>Package Name</span>}
        </h3>
        <h5>{pkg.description || <span style={styles.muted}>Package Description</span>}</h5>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.increment}>
            Increment
          </Button>
          <Button onClick={this.props.push}>
            Push
          </Button>
          <Button onClick={this.props.pop}>
            Pop
          </Button>
          <Button onClick={this.props.replace}>
            Replace
          </Button>
          <Button onClick={this.props.changeNested}>
            Change Nested
          </Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.pushHugeArray}>
            Push Huge Array
          </Button>
          <Button onClick={this.props.addHugeObect}>
            Add Huge Object
          </Button>
          <Button onClick={this.props.hugePayload}>
            Huge Payload
          </Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.addIterator}>
            Add Iterator
          </Button>
          <Button onClick={this.props.addImmutableMap}>
            Add Immutable Map
          </Button>
          <Button onClick={this.props.changeImmutableNested}>
            Change Immutable Nested
          </Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.addRecursive}>
            Add Recursive
          </Button>
          <Button onClick={this.props.addFunction}>
            Add Function
          </Button>
          <Button onClick={this.props.addSymbol}>
            Add Symbol
          </Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.toggleTimeoutUpdate}>
            Timeout Update {this.props.timeoutUpdateEnabled ? 'On' : 'Off'}
          </Button>
          <Button onClick={this.props.shuffleArray}>
            Shuffle Array
          </Button>
          <Spacer />
        </Toolbar>
        <div>
          {options.useExtension ?
            <a href={`${ROOT}`} style={styles.link}>Disable browser extension</a> :
            <a href={`${ROOT}?ext`} style={styles.link}>Use browser extension</a>
          }
        </div>
      </div>
    );
  }

  toggleTimeoutUpdate = () => {
    const enabled = !this.props.timeoutUpdateEnabled;
    this.props.toggleTimeoutUpdate(enabled);

    if (enabled) {
      this.timeout = setInterval(this.props.timeoutUpdate, 1000);
    } else {
      clearTimeout(this.timeout);
    }
  }
}

export default connect(
  state => state,
  {
    toggleTimeoutUpdate: timeoutUpdateEnabled => ({
      type: 'TOGGLE_TIMEOUT_UPDATE', timeoutUpdateEnabled
    }),
    timeoutUpdate: () => ({ type: 'TIMEOUT_UPDATE' }),
    increment: () => ({ type: 'INCREMENT' }),
    push: () => ({ type: 'PUSH' }),
    pop: () => ({ type: 'POP' }),
    replace: () => ({ type: 'REPLACE' }),
    changeNested: () => ({ type: 'CHANGE_NESTED' }),
    pushHugeArray: () => ({ type: 'PUSH_HUGE_ARRAY' }),
    addIterator: () => ({ type: 'ADD_ITERATOR' }),
    addHugeObect: () => ({ type: 'ADD_HUGE_OBJECT' }),
    addRecursive: () => ({ type: 'ADD_RECURSIVE' }),
    addImmutableMap: () => ({ type: 'ADD_IMMUTABLE_MAP' }),
    changeImmutableNested: () => ({ type: 'CHANGE_IMMUTABLE_NESTED' }),
    hugePayload: () => ({
      type: 'HUGE_PAYLOAD',
      payload: Array.from({ length: 10000 }).map((_, i) => i)
    }),
    addFunction: () => ({ type: 'ADD_FUNCTION' }),
    addSymbol: () => ({ type: 'ADD_SYMBOL' }),
    shuffleArray: () => ({ type: 'SHUFFLE_ARRAY' }),
    pushRoute
  }
)(DemoApp);
