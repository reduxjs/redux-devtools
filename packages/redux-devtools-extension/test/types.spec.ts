import { describe, it } from 'vitest';
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

// These assertions are checked by `tsc`, not at runtime: the bodies exist so
// the file type-checks as part of `tsconfig.test.json`.
describe('EnhancerOptions callback types', () => {
  it('accepts a stateSanitizer annotated with the store state type', () => {
    composeWithDevTools({
      stateSanitizer: (state: MyState) => state,
    });
  });

  it('accepts an actionSanitizer annotated with the action type', () => {
    composeWithDevTools({
      actionSanitizer: (action: MyAction) => action,
    });
  });

  it('accepts a predicate annotated with the state and action types', () => {
    composeWithDevTools({
      predicate: (state: MyState, action: MyAction) =>
        action.type === 'foo' && state.foo !== '',
    });
  });

  it('accepts a stateSanitizer returning a redacted copy of the state', () => {
    composeWithDevTools({
      stateSanitizer: (state) => ({
        ...(state as MyState),
        password: '<<REDACTED>>',
      }),
    });
  });

  it('accepts sanitizers on devToolsEnhancer', () => {
    devToolsEnhancer({
      stateSanitizer: (state: MyState) => state,
      actionSanitizer: (action: MyAction) => action,
    });
  });

  it('accepts sanitizers on the developmentOnly entry point', () => {
    composeWithDevToolsDevelopmentOnly({
      stateSanitizer: (state: MyState) => state,
    });
    devToolsEnhancerDevelopmentOnly({
      actionSanitizer: (action: MyAction) => action,
    });
  });

  it('accepts sanitizers on the logOnly entry point', () => {
    composeWithDevToolsLogOnly({
      stateSanitizer: (state: MyState) => state,
    });
    devToolsEnhancerLogOnly({
      actionSanitizer: (action: MyAction) => action,
    });
  });

  it('accepts the sanitizers documented without parameter annotations (control)', () => {
    composeWithDevTools({
      actionSanitizer: (action) =>
        action.type === 'foo' ? { ...action, data: '<<LONG_BLOB>>' } : action,
      stateSanitizer: (state) => state,
    });
  });

  it('still requires actionSanitizer to return an action (control)', () => {
    const options: EnhancerOptions = {
      // @ts-expect-error `{ notAnAction: true }` has no `type` property.
      actionSanitizer: (action: MyAction) => ({ notAnAction: true }),
    };
    void options;
  });

  it('still rejects a non-function sanitizer (control)', () => {
    const options: EnhancerOptions = {
      // @ts-expect-error `stateSanitizer` has to be callable.
      stateSanitizer: 'not a function',
    };
    void options;
  });
});
