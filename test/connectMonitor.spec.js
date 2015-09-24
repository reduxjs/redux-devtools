import expect from 'expect';
import jsdom from 'mocha-jsdom';
import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { connectMonitor, devTools } from '../src';
import { createStore } from 'redux';

class MockMonitor extends Component {
  render() {
    return null;
  }
}

describe('connectMonitor', () => {
  jsdom();

  it('should pass devToolsStore to monitor', () => {
    const store = devTools()(createStore)(() => {});
    const ConnectedMonitor = connectMonitor(MockMonitor);
    const tree = TestUtils.renderIntoDocument(
      <ConnectedMonitor store={store} />
    );
    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    expect(mockMonitor.props.store).toBe(store.devToolsStore);
  });

  it('should pass props to monitor', () => {
    const store = devTools()(createStore)(() => {});
    const ConnectedMonitor = connectMonitor(MockMonitor);
    const tree = TestUtils.renderIntoDocument(
      <ConnectedMonitor store={store} one={1} two={2}/>
    );
    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    expect(mockMonitor.props.one).toBe(1);
    expect(mockMonitor.props.two).toBe(2);
  });

  it('should subscribe monitor to store updates', () => {
    const ConnectedMonitor = connectMonitor(MockMonitor);
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
      <ConnectedMonitor store={store} />
    );

    store.dispatch({type: 'INC'});

    const mockMonitor = TestUtils.findRenderedComponentWithType(tree, MockMonitor);
    const currentStateIndex = mockMonitor.props.currentStateIndex;
    const computedStates = mockMonitor.props.computedStates;

    expect(computedStates[currentStateIndex].state).toBe(1);
  });

  it('should warn if devTools() not in middleware', () => {
    const store = createStore(() => {});
    const ConnectedMonitor = connectMonitor(MockMonitor);

    // Force to re-evaluate propType checks on every run
    ConnectedMonitor.displayName = Math.random().toString();

    const spy = expect.spyOn(console, 'error');
    TestUtils.renderIntoDocument(<ConnectedMonitor store={store} />);
    spy.restore();

    expect(spy.calls).toContain(
      /Could not find the DevTools store/,
      (call, errMsg) => call.arguments[0].match(errMsg)
    );
  });
});
