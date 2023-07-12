import React, { CSSProperties, useRef } from 'react';
import { connect } from 'react-redux';
import { Button, Toolbar, Spacer } from '@redux-devtools/ui';
import pkg from '@redux-devtools/inspector-monitor-test-tab/package.json';
import { useLocation } from 'react-router-dom';
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

function DemoApp(props: Props) {
  const timeout = useRef<number | undefined>();
  const location = useLocation();

  const options = getOptions(location);

  const toggleTimeoutUpdate = () => {
    const enabled = !props.timeoutUpdateEnabled;
    props.toggleTimeoutUpdate(enabled);

    if (enabled) {
      timeout.current = window.setInterval(props.timeoutUpdate, 1000);
    } else {
      clearTimeout(timeout.current);
    }
  };

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
        <Button onClick={props.increment}>Increment</Button>
        <Button onClick={props.push}>Push</Button>
        <Button onClick={props.pop}>Pop</Button>
        <Button onClick={props.replace}>Replace</Button>
        <Button onClick={props.changeNested}>Change Nested</Button>
        <Spacer />
      </Toolbar>
      <Toolbar>
        <Spacer />
        <Button onClick={props.pushHugeArray}>Push Huge Array</Button>
        <Button onClick={props.addHugeObject}>Add Huge Object</Button>
        <Button onClick={props.hugePayload}>Huge Payload</Button>
        <Spacer />
      </Toolbar>
      <Toolbar>
        <Spacer />
        <Button onClick={props.addIterator}>Add Iterator</Button>
        <Button onClick={props.addImmutableMap}>Add Immutable Map</Button>
        <Button onClick={props.changeImmutableNested}>
          Change Immutable Nested
        </Button>
        <Spacer />
      </Toolbar>
      <Toolbar>
        <Spacer />
        <Button onClick={props.addRecursive}>Add Recursive</Button>
        <Button onClick={props.addFunction}>Add Function</Button>
        <Button onClick={props.addSymbol}>Add Symbol</Button>
        <Spacer />
      </Toolbar>
      <Toolbar>
        <Spacer />
        <Button onClick={toggleTimeoutUpdate}>
          Timeout Update {props.timeoutUpdateEnabled ? 'On' : 'Off'}
        </Button>
        <Button onClick={props.shuffleArray}>Shuffle Array</Button>
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

export default connect((state: DemoAppState) => state, {
  toggleTimeoutUpdate: (
    timeoutUpdateEnabled: boolean,
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
})(DemoApp);
