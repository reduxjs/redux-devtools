## Trace actions calls

![trace-demo](https://user-images.githubusercontent.com/7957859/50161148-a1639300-02e3-11e9-80e7-18d3215a0bf8.gif)

One of the features of Redux DevTools is to select an action in the history and see the callstack that triggered it. It aims to solve the problem of finding the source of events in the event list.

By default it's disabled as, depending of the use case, generating and serializing stack traces for every action can impact the performance. To enable it, set `trace` option to `true` as in [examples](https://github.com/zalmoxisus/redux-devtools-extension/commit/64717bb9b3534ff616d9db56c2be680627c7b09d). See [the API](../API/Arguments.md#trace) for more details.

For some edge cases where stack trace cannot be obtained with just `Error().stack`, you can pass a function as `trace` with your implementation. It's useful for cases where the stack is broken, like, for example, [when calling `setTimeout`](https://github.com/zalmoxisus/redux-devtools-instrument/blob/e7c05c98e7e9654cb7db92a2f56c6b5f3ff2452b/test/instrument.spec.js#L735-L737). It takes `action` object as argument and should return `stack` string. This way it can be also used to provide stack conditionally only for certain actions.

There's also an optional `traceLimit` parameter, which is `10` by default, to prevent consuming too much memory and serializing large stacks and also allows you to get larger stacks than limited by the browser (it will overpass default limit of `10` imposed by Chrome in `Error.stackTraceLimit`). If `trace` option is a function, `traceLimit` will have no effect, that should be handled there like so: `trace: () => new Error().stack.split('\n').slice(0, limit+1).join('\n')` (`+1` is needed for Chrome where's an extra 1st frame for `Error\n`).

Apart from opening resources in Chrome DevTools, as seen in the demo above, it can open the file (and jump to the line-column) right in your editor. Pretty useful for debugging, and also as an alternative when it's not possible to use openResource (for Firefox or when using the extension from window or for remote debugging). You can click Settings button and enable that, also adding the path to your project root directory to use. It works out of the box for VSCode, Atom, Webstorm/Phpstorm/IntelliJ, Sublime, Emacs, MacVim, Textmate on Mac and Windows. For Linux you can use [`atom-url-handler`](https://github.com/eclemens/atom-url-handler).
