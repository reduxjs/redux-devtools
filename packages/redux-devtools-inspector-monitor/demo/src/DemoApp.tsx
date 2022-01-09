import React, { CSSProperties } from 'react';
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
import * as base16 from 'base16';
import { push as pushRoute } from 'connected-react-router';
import { Path } from 'history';
import { inspectorThemes } from '@redux-devtools/inspector-monitor';
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
  ...Object.keys(base16)
    .map((value) => ({
      value,
      label: base16[value as keyof typeof base16].scheme,
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
  pushRoute: (path: Path) => void;
}

class DemoApp extends React.Component<Props> {
  timeout?: number;

  render() {
    const options = getOptions(this.props.router.location);

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
                        this.setTheme(options, event.currentTarget.value)
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
                    <a onClick={this.toggleTheme} style={styles.link}>
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
            <Button onClick={this.props.increment} style={styles.button}>
              Increment
            </Button>
            <Button onClick={this.props.push} style={styles.button}>
              Push
            </Button>
            <Button onClick={this.props.pop} style={styles.button}>
              Pop
            </Button>
            <Button onClick={this.props.replace} style={styles.button}>
              Replace
            </Button>
            <Button onClick={this.props.changeNested} style={styles.button}>
              Change Nested
            </Button>
            <Button onClick={this.props.pushHugeArray} style={styles.button}>
              Push Huge Array
            </Button>
            <Button onClick={this.props.addHugeObject} style={styles.button}>
              Add Huge Object
            </Button>
            <Button onClick={this.props.addIterator} style={styles.button}>
              Add Iterator
            </Button>
            <Button onClick={this.props.addRecursive} style={styles.button}>
              Add Recursive
            </Button>
            <Button onClick={this.props.addNativeMap} style={styles.button}>
              Add Native Map
            </Button>
            <Button onClick={this.props.addImmutableMap} style={styles.button}>
              Add Immutable Map
            </Button>
            <Button
              onClick={this.props.changeImmutableNested}
              style={styles.button}
            >
              Change Immutable Nested
            </Button>
            <Button onClick={this.props.hugePayload} style={styles.button}>
              Huge Payload
            </Button>
            <Button onClick={this.props.addFunction} style={styles.button}>
              Add Function
            </Button>
            <Button onClick={this.props.addSymbol} style={styles.button}>
              Add Symbol
            </Button>
            <Button onClick={this.toggleTimeoutUpdate} style={styles.button}>
              Timeout Update {this.props.timeoutUpdateEnabled ? 'On' : 'Off'}
            </Button>
            <Button onClick={this.props.shuffleArray} style={styles.button}>
              Shuffle Array
            </Button>
          </div>
        </div>
        <div style={styles.links}>
          <a onClick={this.toggleExtension} style={styles.link}>
            {(options.useExtension ? 'Disable' : 'Enable') +
              ' Chrome Extension (will reload this page)'}
          </a>
          <a onClick={this.toggleImmutableSupport} style={styles.link}>
            {(options.supportImmutable ? 'Disable' : 'Enable') +
              ' Full Immutable Support'}
          </a>
        </div>
      </div>
    );
  }

  toggleExtension = () => {
    const options = getOptions(this.props.router.location);

    window.location.href = buildUrl({
      ...options,
      useExtension: !options.useExtension,
    });
  };

  toggleImmutableSupport = () => {
    const options = getOptions(this.props.router.location);

    this.props.pushRoute(
      buildUrl({ ...options, supportImmutable: !options.supportImmutable })
    );
  };

  toggleTheme = () => {
    const options = getOptions(this.props.router.location);

    this.props.pushRoute(buildUrl({ ...options, dark: !options.dark }));
  };

  setTheme = (options: Options, theme: string) => {
    this.props.pushRoute(buildUrl({ ...options, theme }));
  };

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
  pushRoute,
})(DemoApp);
