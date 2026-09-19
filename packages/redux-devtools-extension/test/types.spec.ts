import { compose, type Action } from 'redux';
import { describe, expect, it } from 'vitest';
import {
  composeWithDevTools,
  devToolsEnhancer,
  type Config,
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
import {
  composeWithDevTools as composeWithDevToolsLogOnlyInProduction,
  devToolsEnhancer as devToolsEnhancerLogOnlyInProduction,
} from '../src/logOnlyInProduction.js';

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
 * `EnhancerOptions` accepts sanitizer callbacks annotated with the
 * application's own state and action types. Without the browser extension the
 * options reach the fallback implementation, whose behaviour the runtime
 * expectations pin.
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

  it('accepts a stateSanitizer that ignores its arguments', () => {
    const options: EnhancerOptions = {
      stateSanitizer: () => '<<REDACTED>>',
    };

    expect(options.stateSanitizer!(state, 0)).toBe('<<REDACTED>>');
  });

  it('accepts sanitizers annotated with the declared parameter types', () => {
    const stateSanitizer = (state: unknown, index: number): unknown => ({
      state,
      index,
    });
    const actionSanitizer = (
      action: Action<string>,
      id: number,
    ): Action<string> => ({ ...action, type: `${action.type}#${id}` });
    const options: EnhancerOptions = { stateSanitizer, actionSanitizer };

    expect(options.stateSanitizer!(state, 3)).toEqual({ state, index: 3 });
    expect(options.actionSanitizer!({ type: 'foo' }, 7)).toEqual({
      type: 'foo#7',
    });
  });

  it('accepts annotated sanitizers declared inline on an EnhancerOptions object', () => {
    const options: EnhancerOptions = {
      stateSanitizer: (state: MyState) => ({
        ...state,
        password: '<<REDACTED>>',
      }),
      predicate: (state: MyState, action: MyAction) =>
        action.type === 'foo' && state.foo !== '',
    };

    expect(options.stateSanitizer!(state, 0)).toEqual({
      foo: 'bar',
      password: '<<REDACTED>>',
    });
    expect(options.predicate!(state, action)).toBe(true);
  });

  it('hands the caller an unknown sanitized state, which has to be cast', () => {
    const options: EnhancerOptions = { stateSanitizer: (state) => state };
    const sanitized = options.stateSanitizer!(state, 0);

    // @ts-expect-error the sanitized state is `unknown`, so reading a property
    // off it requires a cast. On the unfixed signature it was `S`, i.e. the
    // caller's own state type, and this directive was unused.
    expect(sanitized.foo).toBe('bar');
    expect((sanitized as MyState).foo).toBe('bar');
  });

  it('hands the caller a plain action from actionSanitizer, which has to be cast', () => {
    const options: EnhancerOptions = { actionSanitizer: (action) => action };
    const sanitized = options.actionSanitizer!(action, 0);

    // @ts-expect-error the sanitized action is `Action<string>`, so reading a
    // custom property off it requires a cast. On the unfixed signature it was
    // `A`, i.e. the caller's own action type, and this directive was unused.
    expect(sanitized.password).toBe('hunter2');
    expect((sanitized as MyAction).password).toBe('hunter2');
  });

  it('accepts annotated sanitizers on devToolsEnhancer', () => {
    const enhancer = devToolsEnhancer({
      stateSanitizer: (state: MyState) => state,
      actionSanitizer: (action: MyAction) => action,
    });

    expect(typeof enhancer).toBe('function');
  });

  it('accepts an annotated predicate on devToolsEnhancer', () => {
    const enhancer = devToolsEnhancer({
      predicate: (state: MyState, action: MyAction) =>
        state.foo !== '' && action.type === 'foo',
    });

    expect(typeof enhancer).toBe('function');
  });

  it('accepts annotated sanitizers on a Config-typed options object', () => {
    const config: Config = {
      type: 'redux',
      stateSanitizer: (state: MyState) => state,
      predicate: (state: MyState) => state.foo !== '',
    };

    expect(composeWithDevTools(config)).toBe(compose);
    expect(config.predicate!(state, action)).toBe(true);
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

  it('accepts annotated sanitizers on the logOnlyInProduction entry point', () => {
    expect(
      composeWithDevToolsLogOnlyInProduction({
        stateSanitizer: (state: MyState) => state,
      }),
    ).toBe(compose);
    expect(
      typeof devToolsEnhancerLogOnlyInProduction({
        predicate: (state: MyState) => state.foo !== '',
      }),
    ).toBe('function');
  });

  it('keeps all three options optional (control)', () => {
    const empty: EnhancerOptions = {};
    const explicitlyUndefined: EnhancerOptions = {
      stateSanitizer: undefined,
      actionSanitizer: undefined,
      predicate: undefined,
    };

    expect(composeWithDevTools(empty)).toBe(compose);
    expect(typeof explicitlyUndefined.stateSanitizer).toBe('undefined');
    expect(typeof explicitlyUndefined.actionSanitizer).toBe('undefined');
    expect(typeof explicitlyUndefined.predicate).toBe('undefined');
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

  it('still accepts a sanitizer written with its own generic (control)', () => {
    const options: EnhancerOptions = {
      stateSanitizer: <S>(state: S, index: number): S => state,
    };

    expect(options.stateSanitizer!(state, 0)).toBe(state);
  });

  it('accepts a predicate written with the declared parameter types (control)', () => {
    const predicate = (state: unknown, action: Action<string>): boolean =>
      state !== undefined && action.type !== '';
    const options: EnhancerOptions = { predicate };

    expect(options.predicate!(state, action)).toBe(true);
  });

  it('accepts falsy but valid state and boundary indices (control)', () => {
    const options: EnhancerOptions = { stateSanitizer: (state) => state };

    expect(options.stateSanitizer!(0, 0)).toBe(0);
    expect(options.stateSanitizer!('', -1)).toBe('');
    expect(options.stateSanitizer!(null, Number.MAX_SAFE_INTEGER)).toBe(null);
    expect(options.stateSanitizer!(undefined, 0)).toBe(undefined);
    expect(options.stateSanitizer!([], 0)).toEqual([]);
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

  it('leaves trace rejecting an annotated callback (control)', () => {
    const options: EnhancerOptions = {
      // @ts-expect-error `trace` is a union member, so it keeps its own
      // generic and still rejects an annotated callback. Fixing it is a
      // separate change.
      trace: (action: MyAction) => action.type,
    };

    expect(typeof options.trace).toBe('function');
  });

  it('still accepts the documented trace forms (control)', () => {
    const traced: EnhancerOptions = { trace: () => 'stack' };
    const enabled: EnhancerOptions = { trace: true };

    expect((traced.trace as () => string)()).toBe('stack');
    expect(enabled.trace).toBe(true);
  });
});
