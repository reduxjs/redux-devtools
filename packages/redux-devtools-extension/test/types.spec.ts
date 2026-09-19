import { compose } from 'redux';
import { describe, expect, it } from 'vitest';
import {
  composeWithDevTools,
  devToolsEnhancer,
  type EnhancerOptions,
} from '../src/index.js';
import {
  composeWithDevTools as composeWithDevToolsDevelopmentOnly,
  devToolsEnhancer as devToolsEnhancerDevelopmentOnly,
} from '../src/developmentOnly.js';
import {
  composeWithDevTools as composeWithDevToolsLogOnly,
  devToolsEnhancer as devToolsEnhancerLogOnly,
} from '../src/logOnly.js';

interface MyState {
  foo: string;
  password: string;
}

interface MyAction {
  type: 'foo';
  password?: string;
}

const state: MyState = { foo: 'bar', password: 'hunter2' };
const action: MyAction = { type: 'foo', password: 'hunter2' };

/**
 * A sanitizer annotated with the store's own state or action type used to be
 * rejected by `tsc`, because the callbacks declared their own generics. These
 * cases therefore fail to compile against the unfixed `EnhancerOptions`; the
 * runtime expectations pin the behaviour of the no-extension stubs.
 */
describe('EnhancerOptions callback types', () => {
  it('accepts a stateSanitizer annotated with the store state type', () => {
    const stateSanitizer = (state: MyState) => ({
      ...state,
      password: '<<REDACTED>>',
    });

    expect(composeWithDevTools({ stateSanitizer })).toBe(compose);
    expect(stateSanitizer(state)).toEqual({
      foo: 'bar',
      password: '<<REDACTED>>',
    });
  });

  it('accepts an actionSanitizer annotated with the action type', () => {
    const actionSanitizer = (action: MyAction) => ({
      ...action,
      password: '<<REDACTED>>',
    });

    expect(composeWithDevTools({ actionSanitizer })).toBe(compose);
    expect(actionSanitizer(action)).toEqual({
      type: 'foo',
      password: '<<REDACTED>>',
    });
  });

  it('accepts a predicate annotated with the state and action types', () => {
    const predicate = (state: MyState, action: MyAction) =>
      action.type === 'foo' && state.foo !== '';

    expect(composeWithDevTools({ predicate })).toBe(compose);
    expect(predicate(state, action)).toBe(true);
  });

  it('accepts a stateSanitizer that casts the state it is given', () => {
    const options: EnhancerOptions = {
      stateSanitizer: (state) => ({
        ...(state as MyState),
        password: '<<REDACTED>>',
      }),
    };

    expect(options.stateSanitizer!(state, 0)).toEqual({
      foo: 'bar',
      password: '<<REDACTED>>',
    });
  });

  it('accepts annotated sanitizers on devToolsEnhancer', () => {
    const enhancer = devToolsEnhancer({
      stateSanitizer: (state: MyState) => state,
      actionSanitizer: (action: MyAction) => action,
    });

    expect(typeof enhancer).toBe('function');
  });

  it('accepts annotated sanitizers on the developmentOnly entry point', () => {
    expect(
      composeWithDevToolsDevelopmentOnly({
        stateSanitizer: (state: MyState) => state,
      }),
    ).toBe(compose);
    expect(
      typeof devToolsEnhancerDevelopmentOnly({
        actionSanitizer: (action: MyAction) => action,
      }),
    ).toBe('function');
  });

  it('accepts annotated sanitizers on the logOnly entry point', () => {
    expect(
      typeof composeWithDevToolsLogOnly({
        stateSanitizer: (state: MyState) => state,
      }),
    ).toBe('function');
    expect(
      typeof devToolsEnhancerLogOnly({
        actionSanitizer: (action: MyAction) => action,
      }),
    ).toBe('function');
  });

  it('accepts the sanitizers as documented, without annotations (control)', () => {
    const options: EnhancerOptions = {
      actionSanitizer: (action) =>
        action.type === 'foo' ? { ...action, data: '<<LONG_BLOB>>' } : action,
      stateSanitizer: (state) => state,
    };

    expect(options.actionSanitizer!(action, 0)).toEqual({
      type: 'foo',
      password: 'hunter2',
      data: '<<LONG_BLOB>>',
    });
    expect(options.stateSanitizer!(state, 0)).toBe(state);
  });

  it('still requires actionSanitizer to return an action (control)', () => {
    const options: EnhancerOptions = {
      // @ts-expect-error `{ notAnAction: true }` has no `type` property.
      actionSanitizer: (action: MyAction) => ({ notAnAction: true }),
    };

    expect(typeof options.actionSanitizer).toBe('function');
  });

  it('still rejects a non-callable sanitizer (control)', () => {
    const options: EnhancerOptions = {
      // @ts-expect-error `stateSanitizer` has to be a function.
      stateSanitizer: '<<REDACTED>>',
    };

    expect(typeof options.stateSanitizer).toBe('string');
  });
});
