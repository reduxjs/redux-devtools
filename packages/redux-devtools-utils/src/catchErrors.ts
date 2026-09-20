const ERROR = '@@redux-devtools/ERROR';

export interface ErrorAction {
  type: typeof ERROR;
  message?: Event | string;
  url?: string | undefined;
  lineNo?: number | undefined;
  columnNo?: number | undefined;
  stack?: string;
  error?: Error;
  isFatal?: boolean;
  sourceURL?: string;
  line?: number;
  column?: number;
}

export function catchErrors(sendError: (errorAction: ErrorAction) => void) {
  if (typeof window === 'object' && typeof window.onerror === 'object') {
    window.onerror = function (message, url, lineNo, columnNo, error) {
      const errorAction: ErrorAction = {
        type: ERROR,
        message,
        url,
        lineNo,
        columnNo,
      };
      if (error && error.stack) errorAction.stack = error.stack;
      sendError(errorAction);
      return false;
    };
  } else if (typeof global !== 'undefined' && (global as any).ErrorUtils) {
    (global as any).ErrorUtils.setGlobalHandler(
      (error: Error, isFatal: boolean) => {
        sendError({ type: ERROR, error, isFatal });
      },
    );
  }

  if (
    typeof console === 'object' &&
    typeof console.error === 'function' &&
    !(console as any).beforeRemotedev
  ) {
    (console as any).beforeRemotedev = console.error.bind(console);
    console.error = function () {
      let errorAction: ErrorAction = { type: ERROR };
      const error = arguments[0];
      errorAction.message = error.message ? error.message : error;
      if (error.sourceURL) {
        errorAction = {
          ...errorAction,
          sourceURL: error.sourceURL,
          line: error.line,
          column: error.column,
        };
      }
      if (error.stack) errorAction.stack = error.stack;
      sendError(errorAction);
      (console as any).beforeRemotedev.apply(null, arguments);
    };
  }
}
