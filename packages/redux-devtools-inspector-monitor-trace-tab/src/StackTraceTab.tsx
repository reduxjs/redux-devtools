import React, { Component } from 'react';

import { getStackFrames } from './react-error-overlay/utils/getStackFrames';
import StackTrace from './react-error-overlay/containers/StackTrace';
import openFile from './openFile';
import { Action } from 'redux';
import { TabComponentProps } from '@redux-devtools/inspector-monitor';
import StackFrame from './react-error-overlay/utils/stack-frame';
import { ErrorLocation } from './react-error-overlay/utils/parseCompileError';

const rootStyle = { padding: '5px 10px' };

interface Props<S, A extends Action<string>> extends TabComponentProps<S, A> {
  openFile: (
    fileName: string,
    lineNumber: number,
    stackFrame: StackFrame,
  ) => void;
}

interface State {
  stackFrames: StackFrame[];
  currentError?: Error;
  showDocsLink?: boolean;
}

export class TraceTab<S, A extends Action<string>> extends Component<
  Props<S, A>,
  State
> {
  static defaultProps = {
    openFile,
  };

  state: State = {
    stackFrames: [],
  };

  componentDidMount() {
    // console.log("StackTraceTab mounted");
    this.checkForStackTrace();
  }

  componentDidUpdate(prevProps: Props<S, A>) {
    const { action, actions } = prevProps;

    if (action !== this.props.action || actions !== this.props.actions) {
      this.checkForStackTrace();
    }
  }

  checkForStackTrace() {
    const { action, actions: liftedActionsById } = this.props;

    if (!action) {
      return;
    }

    const liftedActions = Object.values(liftedActionsById);
    const liftedAction = liftedActions.find(
      (liftedAction) => liftedAction.action === action,
    );

    if (liftedAction && typeof liftedAction.stack === 'string') {
      const deserializedError = Object.assign(new Error(), {
        stack: liftedAction.stack,
      });

      getStackFrames(deserializedError)
        .then((stackFrames) => {
          this.setState({
            stackFrames: stackFrames!,
            currentError: deserializedError,
          });
        })
        .catch(() => {
          // noop
        });
    } else {
      this.setState({
        stackFrames: [],
        showDocsLink:
          !!liftedAction!.action &&
          !!liftedAction!.action.type &&
          liftedAction!.action.type !== '@@INIT',
      });
    }
  }

  onStackLocationClicked = (fileLocation: Partial<ErrorLocation> = {}) => {
    // console.log("Stack location args: ", ...args);

    const { fileName, lineNumber } = fileLocation;

    if (fileName && lineNumber) {
      const matchingStackFrame = this.state.stackFrames.find((stackFrame) => {
        const matches =
          (stackFrame._originalFileName === fileName &&
            stackFrame._originalLineNumber === lineNumber) ||
          (stackFrame.fileName === fileName &&
            stackFrame.lineNumber === lineNumber);
        return matches;
      });

      // console.log("Matching stack frame: ", matchingStackFrame);

      if (matchingStackFrame) {
        /*
        const frameIndex = this.state.stackFrames.indexOf(matchingStackFrame);
        const originalStackFrame = parsedFramesNoSourcemaps[frameIndex];
        console.log("Original stack frame: ", originalStackFrame);
        */
        this.props.openFile(fileName, lineNumber, matchingStackFrame);
      }
    }
  };

  openDocs: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.stopPropagation();
    window.open(
      'https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Features/Trace.md',
    );
  };

  render() {
    const { stackFrames, showDocsLink } = this.state;

    if (showDocsLink) {
      return (
        <div style={rootStyle}>
          To enable tracing action calls, you should set `trace` option to
          `true` for Redux DevTools enhancer. Refer to{' '}
          <a href="#" onClick={this.openDocs}>
            this page
          </a>{' '}
          for more details.
        </div>
      );
    }

    return (
      <div style={rootStyle}>
        <StackTrace
          stackFrames={stackFrames}
          errorName="N/A"
          contextSize={3}
          editorHandler={this.onStackLocationClicked}
        />
      </div>
    );
  }
}
