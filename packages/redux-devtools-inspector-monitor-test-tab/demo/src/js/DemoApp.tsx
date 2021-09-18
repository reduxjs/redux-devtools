import React, { CSSProperties } from 'react';
import { connect } from 'react-redux';
import { Button, Toolbar, Spacer } from '@redux-devtools/ui';
import { push as pushRoute } from 'connected-react-router';
import pkg from '../../../package.json';
import getOptions from './getOptions';
import { DemoAppState } from './reducers';
import {
  AddFunctionAction,
  AddHugeObjectAction,
  AddImmutableMapAction,
  AddIteratorAction,
  AddRecursiveAction,
  AddSymbolAction,
  ChangeImmutableNestedAction,
  ChangeNestedAction,
  HugePayloadAction,
  IncrementAction,
  PopAction,
  PushAction,
  PushHugeArrayAction,
  ReplaceAction,
  ShuffleArrayAction,
  TimeoutUpdateAction,
  ToggleTimeoutUpdateAction,
} from './reducers';

const styles: {
  wrapper: CSSProperties;
  muted: CSSProperties;
  link: CSSProperties;
} = {
  wrapper: {
    height: '100vh',
    width: '450px',
    margin: 'auto',
    textAlign: 'center',
  },
  muted: {
    color: '#CCCCCC',
  },
  link: {
    margin: '0 0.5rem',
    cursor: 'pointer',
    display: 'block',
  },
};

const ROOT = '/'; // process.env.NODE_ENV === 'production' ? '/' : '/';

interface Props
  extends Omit<DemoAppState, 'addFunction' | 'addSymbol' | 'shuffleArray'> {
  toggleTimeoutUpdate: (timeoutUpdateEnabled: boolean) => void;
  timeoutUpdate: () => void;
  increment: () => void;
  push: () => void;
  pop: () => void;
  replace: () => void;
  changeNested: () => void;
  pushHugeArray: () => void;
  addIterator: () => void;
  addHugeObject: () => void;
  addRecursive: () => void;
  addImmutableMap: () => void;
  changeImmutableNested: () => void;
  hugePayload: () => void;
  addFunction: () => void;
  addSymbol: () => void;
  shuffleArray: () => void;
}

class DemoApp extends React.Component<Props> {
  timeout?: number;

  render() {
    const options = getOptions(this.props.router.location);

    return (
      <div style={styles.wrapper}>
        <h3>{pkg.name || <span style={styles.muted}>Package Name</span>}</h3>
        <h5>
          {pkg.description || (
            <span style={styles.muted}>Package Description</span>
          )}
        </h5>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.increment}>Increment</Button>
          <Button onClick={this.props.push}>Push</Button>
          <Button onClick={this.props.pop}>Pop</Button>
          <Button onClick={this.props.replace}>Replace</Button>
          <Button onClick={this.props.changeNested}>Change Nested</Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.pushHugeArray}>Push Huge Array</Button>
          <Button onClick={this.props.addHugeObject}>Add Huge Object</Button>
          <Button onClick={this.props.hugePayload}>Huge Payload</Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.props.addIterator}>Add Iterator</Button>
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
          <Button onClick={this.props.addRecursive}>Add Recursive</Button>
          <Button onClick={this.props.addFunction}>Add Function</Button>
          <Button onClick={this.props.addSymbol}>Add Symbol</Button>
          <Spacer />
        </Toolbar>
        <Toolbar>
          <Spacer />
          <Button onClick={this.toggleTimeoutUpdate}>
            Timeout Update {this.props.timeoutUpdateEnabled ? 'On' : 'Off'}
          </Button>
          <Button onClick={this.props.shuffleArray}>Shuffle Array</Button>
          <Spacer />
        </Toolbar>
        <div>
          {options.useExtension ? (
            <a href={`${ROOT}`} style={styles.link}>
              Disable browser extension
            </a>
          ) : (
            <a href={`${ROOT}?ext`} style={styles.link}>
              Use browser extension
            </a>
          )}
        </div>
      </div>
    );
  }

  toggleTimeoutUpdate = () => {
    const enabled = !this.props.timeoutUpdateEnabled;
    this.props.toggleTimeoutUpdate(enabled);

    if (enabled) {
      this.timeout = window.setInterval(this.props.timeoutUpdate, 1000);
    } else {
      clearTimeout(this.timeout);
    }
  };
}

export default connect((state: DemoAppState) => state, {
  toggleTimeoutUpdate: (
    timeoutUpdateEnabled: boolean
  ): ToggleTimeoutUpdateAction => ({
    type: 'TOGGLE_TIMEOUT_UPDATE',
    timeoutUpdateEnabled,
  }),
  timeoutUpdate: (): TimeoutUpdateAction => ({ type: 'TIMEOUT_UPDATE' }),
  increment: (): IncrementAction => ({ type: 'INCREMENT' }),
  push: (): PushAction => ({ type: 'PUSH' }),
  pop: (): PopAction => ({ type: 'POP' }),
  replace: (): ReplaceAction => ({ type: 'REPLACE' }),
  changeNested: (): ChangeNestedAction => ({ type: 'CHANGE_NESTED' }),
  pushHugeArray: (): PushHugeArrayAction => ({ type: 'PUSH_HUGE_ARRAY' }),
  addIterator: (): AddIteratorAction => ({ type: 'ADD_ITERATOR' }),
  addHugeObject: (): AddHugeObjectAction => ({ type: 'ADD_HUGE_OBJECT' }),
  addRecursive: (): AddRecursiveAction => ({ type: 'ADD_RECURSIVE' }),
  addImmutableMap: (): AddImmutableMapAction => ({ type: 'ADD_IMMUTABLE_MAP' }),
  changeImmutableNested: (): ChangeImmutableNestedAction => ({
    type: 'CHANGE_IMMUTABLE_NESTED',
  }),
  hugePayload: (): HugePayloadAction => ({
    type: 'HUGE_PAYLOAD',
    payload: Array.from({ length: 10000 }).map((_, i) => i),
  }),
  addFunction: (): AddFunctionAction => ({ type: 'ADD_FUNCTION' }),
  addSymbol: (): AddSymbolAction => ({ type: 'ADD_SYMBOL' }),
  shuffleArray: (): ShuffleArrayAction => ({ type: 'SHUFFLE_ARRAY' }),
  pushRoute,
})(DemoApp);
