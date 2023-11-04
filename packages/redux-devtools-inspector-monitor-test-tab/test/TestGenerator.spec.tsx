import React from 'react';
import { render } from '@testing-library/react';
import { PerformAction } from '@redux-devtools/core';
import { Action } from 'redux';
import TestGenerator from '../src/TestGenerator';
import fnTemplate from '../src/redux/mocha';
import strTemplate from '../src/redux/mocha/template';
import fnVanillaTemplate from '../src/vanilla/mocha';
import strVanillaTemplate from '../src/vanilla/mocha/template';

const actions: { [actionId: number]: PerformAction<Action<string>> } = {
  0: {
    type: 'PERFORM_ACTION',
    action: { type: '@@INIT' },
    timestamp: 0,
    stack: undefined,
  },
  1: {
    type: 'PERFORM_ACTION',
    action: { type: 'INCREMENT_COUNTER' },
    timestamp: 0,
    stack: undefined,
  },
};

const computedStates = [{ state: { counter: 0 } }, { state: { counter: 1 } }];

const TestGeneratorAsAny = TestGenerator as any;

describe('TestGenerator component', () => {
  it('should show warning message when no params provided', () => {
    const { container } = render(<TestGeneratorAsAny useCodemirror={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should be empty when no actions provided', () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={fnTemplate.assertion}
        dispatcher={fnTemplate.dispatcher}
        wrap={fnTemplate.wrap}
        useCodemirror={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match function template's test for first action", () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={fnTemplate.assertion}
        dispatcher={fnTemplate.dispatcher}
        wrap={fnTemplate.wrap}
        actions={actions}
        computedStates={computedStates}
        selectedActionId={1}
        useCodemirror={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should match string template's test for first action", () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={strTemplate.assertion}
        dispatcher={strTemplate.dispatcher}
        wrap={strTemplate.wrap}
        useCodemirror={false}
        actions={actions}
        computedStates={computedStates}
        selectedActionId={1}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should generate test for the last action when selectedActionId not specified', () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={fnTemplate.assertion}
        dispatcher={fnTemplate.dispatcher}
        wrap={fnTemplate.wrap}
        actions={actions}
        computedStates={computedStates}
        useCodemirror={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should generate test for vanilla js class', () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={fnVanillaTemplate.assertion}
        dispatcher={fnVanillaTemplate.dispatcher}
        wrap={fnVanillaTemplate.wrap}
        actions={actions}
        computedStates={computedStates}
        selectedActionId={1}
        isVanilla
        name="SomeStore"
        useCodemirror={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should generate test for vanilla js class with string template', () => {
    const { container } = render(
      <TestGeneratorAsAny
        assertion={strVanillaTemplate.assertion}
        dispatcher={strVanillaTemplate.dispatcher}
        wrap={strVanillaTemplate.wrap}
        actions={actions}
        computedStates={computedStates}
        selectedActionId={1}
        isVanilla
        name="SomeStore"
        useCodemirror={false}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
