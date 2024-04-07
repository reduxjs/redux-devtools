import React, { CSSProperties, useRef } from 'react';
import { connect } from 'react-redux';
import pkg from '@redux-devtools/inspector-monitor/package.json';
import Button from 'react-bootstrap/Button';
import FormGroup from 'react-bootstrap/FormGroup';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { base16Themes } from 'react-base16-styling';
import { inspectorThemes } from '@redux-devtools/inspector-monitor';
import { useLocation, useNavigate } from 'react-router-dom';
import getOptions, { Options } from './getOptions';
import {
  AddFunctionAction,
  AddHugeObjectAction,
  AddImmutableMapAction,
  AddIteratorAction,
  AddNativeMapAction,
  AddRecursiveAction,
  AddSymbolAction,
  ChangeImmutableNestedAction,
  ChangeNestedAction,
  DemoAppState,
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
  header: CSSProperties;
  content: CSSProperties;
  buttons: CSSProperties;
  muted: CSSProperties;
  button: CSSProperties;
  links: CSSProperties;
  link: CSSProperties;
  input: CSSProperties;
} = {
  wrapper: {
    height: '100vh',
    width: '80%',
    margin: '0 auto',
    paddingTop: '1px',
  },
  header: {},
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
  },
  buttons: {
    display: 'flex',
    width: '40rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  muted: {
    color: '#CCCCCC',
  },
  button: {
    margin: '0.5rem',
  },
  links: {
    textAlign: 'center',
  },
  link: {
    margin: '0 0.5rem',
    cursor: 'pointer',
    display: 'block',
  },
  input: {
    display: 'inline-block',
    textAlign: 'left',
    width: '30rem',
  },
};

const themeOptions = [
  ...Object.keys(inspectorThemes).map((value) => ({
    value,
    label: inspectorThemes[value as keyof typeof inspectorThemes].scheme,
  })),
  null,
  ...Object.keys(base16Themes)
    .map((value) => ({
      value,
      label: base16Themes[value as keyof typeof base16Themes].scheme,
    }))
    .filter((opt) => opt.label),
];

const ROOT =
  process.env.NODE_ENV === 'production'
    ? '/redux-devtools-inspector-monitor/'
    : '/';

function buildUrl(options: Options) {
  return (
    `${ROOT}?` +
    [
      options.useExtension ? 'ext' : '',
      options.supportImmutable ? 'immutable' : '',
      options.theme ? 'theme=' + options.theme : '',
      options.dark ? 'dark' : '',
    ]
      .filter((s) => s)
      .join('&')
  );
}

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
  addNativeMap: () => void;
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
  const navigate = useNavigate();

  const toggleExtension = () => {
    const options = getOptions(location);

    window.location.href = buildUrl({
      ...options,
      useExtension: !options.useExtension,
    });
  };

  const toggleImmutableSupport = () => {
    const options = getOptions(location);

    navigate(
      buildUrl({ ...options, supportImmutable: !options.supportImmutable }),
    );
  };

  const toggleTheme = () => {
    const options = getOptions(location);

    navigate(buildUrl({ ...options, dark: !options.dark }));
  };

  const setTheme = (options: Options, theme: string) => {
    navigate(buildUrl({ ...options, theme }));
  };

  const toggleTimeoutUpdate = () => {
    const enabled = !props.timeoutUpdateEnabled;
    props.toggleTimeoutUpdate(enabled);

    if (enabled) {
      timeout.current = window.setInterval(props.timeoutUpdate, 1000);
    } else {
      clearTimeout(timeout.current);
    }
  };

  const options = getOptions(location);

  return (
    <div style={styles.wrapper}>
      <h1 style={styles.header}>
        {pkg.name || <span style={styles.muted}>Package Name</span>}
      </h1>
      <h5>
        {pkg.description || (
          <span style={styles.muted}>Package Description</span>
        )}
      </h5>
      <div style={styles.links}>
        <div style={styles.input}>
          <Form>
            <FormGroup as={Row}>
              <Col as={FormLabel} sm={3}>
                Theme:
              </Col>
              <Col sm={9}>
                <InputGroup>
                  <FormControl
                    as="select"
                    onChange={(event) =>
                      setTheme(options, event.currentTarget.value)
                    }
                  >
                    {themeOptions.map((theme) => (
                      <option
                        key={(theme && theme.label) || 'empty'}
                        label={(theme && theme.label) || '──────────'}
                        value={theme ? theme.value : undefined}
                        disabled={!theme}
                      />
                    ))}
                  </FormControl>
                  <a onClick={toggleTheme} style={styles.link}>
                    {options.dark ? 'Light theme' : 'Dark theme'}
                  </a>
                </InputGroup>
              </Col>
            </FormGroup>
          </Form>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.buttons}>
          <Button onClick={props.increment} style={styles.button}>
            Increment
          </Button>
          <Button onClick={props.push} style={styles.button}>
            Push
          </Button>
          <Button onClick={props.pop} style={styles.button}>
            Pop
          </Button>
          <Button onClick={props.replace} style={styles.button}>
            Replace
          </Button>
          <Button onClick={props.changeNested} style={styles.button}>
            Change Nested
          </Button>
          <Button onClick={props.pushHugeArray} style={styles.button}>
            Push Huge Array
          </Button>
          <Button onClick={props.addHugeObject} style={styles.button}>
            Add Huge Object
          </Button>
          <Button onClick={props.addIterator} style={styles.button}>
            Add Iterator
          </Button>
          <Button onClick={props.addRecursive} style={styles.button}>
            Add Recursive
          </Button>
          <Button onClick={props.addNativeMap} style={styles.button}>
            Add Native Map
          </Button>
          <Button onClick={props.addImmutableMap} style={styles.button}>
            Add Immutable Map
          </Button>
          <Button onClick={props.changeImmutableNested} style={styles.button}>
            Change Immutable Nested
          </Button>
          <Button onClick={props.hugePayload} style={styles.button}>
            Huge Payload
          </Button>
          <Button onClick={props.addFunction} style={styles.button}>
            Add Function
          </Button>
          <Button onClick={props.addSymbol} style={styles.button}>
            Add Symbol
          </Button>
          <Button onClick={toggleTimeoutUpdate} style={styles.button}>
            Timeout Update {props.timeoutUpdateEnabled ? 'On' : 'Off'}
          </Button>
          <Button onClick={props.shuffleArray} style={styles.button}>
            Shuffle Array
          </Button>
        </div>
      </div>
      <div style={styles.links}>
        <a onClick={toggleExtension} style={styles.link}>
          {(options.useExtension ? 'Disable' : 'Enable') +
            ' Chrome Extension (will reload this page)'}
        </a>
        <a onClick={toggleImmutableSupport} style={styles.link}>
          {(options.supportImmutable ? 'Disable' : 'Enable') +
            ' Full Immutable Support'}
        </a>
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
  addNativeMap: (): AddNativeMapAction => ({ type: 'ADD_NATIVE_MAP' }),
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
