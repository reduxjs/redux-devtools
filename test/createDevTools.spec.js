import expect from 'expect';
import jsdom from 'mocha-jsdom';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import createDevTools from '../src/createDevTools';
import devTools from '../src/devTools';
import { createStore } from 'redux';

class MockMonitor extends Component {
  render() {
    return null;
  }
}

describe('createDevTools', () => {
  jsdom();

  it('should pass devToolsStore to monitor', () => {
    const store = devTools()(createStore)(() => {});
    const DevTools = createDevTools(React);
    const tree = TestUtils.renderIntoDocument(
      <DevTools monitor={MockMonitor} store={store} />
    );
    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    expect(mockMonitor.props.store).toBe(store.devToolsStore);
  });

  it('should pass props to monitor', () => {
    const store = devTools()(createStore)(() => {});
    const DevTools = createDevTools(React);
    const tree = TestUtils.renderIntoDocument(
      <DevTools monitor={MockMonitor} store={store} one={1} two={2}/>
    );
    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    expect(mockMonitor.props.one).toBe(1);
    expect(mockMonitor.props.two).toBe(2);
  });

  it('should subscribe monitor to store updates', () => {
    const DevTools = createDevTools(React);
    const store = devTools()(createStore)(
      (state, action) => {
        switch (action.type) {
        case 'INC':
          return state + 1;
        default:
          return state;
        }
      },
      0
    );
    const tree = TestUtils.renderIntoDocument(
      <DevTools monitor={MockMonitor} store={store} />
    );

    store.dispatch({type: 'INC'});

    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    const currentStateIndex = mockMonitor.props.currentStateIndex;
    const computedStates = mockMonitor.props.computedStates;

    expect(computedStates[currentStateIndex].state).toBe(1);
  });

  it('should warn if devTools() not in middleware', () => {
    const spy = expect.spyOn(console, 'error');
    const store = createStore(() => {});
    const DevTools = createDevTools(React);

    expect(
      TestUtils.renderIntoDocument,
    ).withArgs(
      <DevTools monitor={MockMonitor} store={store} />
    ).toThrow();

    expect(spy.calls).toContain(
      /Could not find the devTools store/,
      (call, errMsg) => call.arguments[0].match(errMsg)
    );

    spy.restore();
  });
});
