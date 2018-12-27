const ERROR = '@@remotedev/ERROR';

export default function catchErrors(sendError) {
  if (typeof window === 'object' && typeof window.onerror === 'object') {
    window.onerror = function (message, url, lineNo, columnNo, error) {
      const errorAction = { type: ERROR, message, url, lineNo, columnNo };
      if (error && error.stack) errorAction.stack = error.stack;
      sendError(errorAction);
      return false;
    };
  } else if (typeof global !== 'undefined' && global.ErrorUtils) {
    global.ErrorUtils.setGlobalHandler((error, isFatal) => {
      sendError({ type: ERROR, error, isFatal });
    });
  }

  if (
    typeof console === 'object' && typeof console.error === 'function' && !console.beforeRemotedev
  ) {
    console.beforeRemotedev = console.error.bind(console);
    console.error = function () {
      let errorAction = { type: ERROR };
      const error = arguments[0];
      errorAction.message = error.message ? error.message : error;
      if (error.sourceURL) {
        errorAction = {
          ...errorAction, sourceURL: error.sourceURL, line: error.line, column: error.column
        };
      }
      if (error.stack) errorAction.stack = error.stack;
      sendError(errorAction);
      console.beforeRemotedev.apply(null, arguments);
    };
  }
}
