import React, { Component, PropTypes } from 'react';

import {getStackFrames} from './react-error-overlay/utils/getStackFrames';
import StackTrace from './react-error-overlay/containers/StackTrace';
import openFile from './openFile';

const rootStyle = {padding: '5px 10px'};

export default class StackTraceTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stackFrames: []
    };
  }
  componentDidMount() {
    // console.log("StackTraceTab mounted");
    this.checkForStackTrace();
  }

  componentDidUpdate(prevProps) {
    const {action, actions} = prevProps;

    if(action !== this.props.action || actions !== this.props.actions) {
      this.checkForStackTrace();
    }
  }

  checkForStackTrace() {
    const {action, actions: liftedActionsById} = this.props;

    if(!action) {
      return;
    }

    const liftedActions = Object.values(liftedActionsById);
    const liftedAction = liftedActions.find(liftedAction => liftedAction.action === action);

    if(liftedAction && typeof liftedAction.stack === 'string') {
      const deserializedError = Object.assign(new Error(), {stack: liftedAction.stack});

      getStackFrames(deserializedError)
        .then(stackFrames => {
          /* eslint-disable no-console */
          if (process.env.NODE_ENV === 'development') console.log('Stack frames: ', stackFrames);
          /* eslint-enable no-console */
          this.setState({stackFrames, currentError: deserializedError});
        });
    }
    else {
      this.setState({
        stackFrames: [],
        showDocsLink: liftedAction.action && liftedAction.action.type && liftedAction.action.type !== '@@INIT'
      });
    }
  }

  onStackLocationClicked = (fileLocation = {}) => {
    // console.log("Stack location args: ", ...args);

    const {fileName, lineNumber} = fileLocation;

    if(fileName && lineNumber) {
      const matchingStackFrame = this.state.stackFrames.find(stackFrame => {
        const matches = (
          (stackFrame._originalFileName === fileName && stackFrame._originalLineNumber === lineNumber) ||
          (stackFrame.fileName === fileName && stackFrame.lineNumber === lineNumber)
        );
        return matches;
      });

      // console.log("Matching stack frame: ", matchingStackFrame);

      if(matchingStackFrame) {
        /*
        const frameIndex = this.state.stackFrames.indexOf(matchingStackFrame);
        const originalStackFrame = parsedFramesNoSourcemaps[frameIndex];
        console.log("Original stack frame: ", originalStackFrame);
        */
        openFile(fileName, lineNumber, matchingStackFrame);
      }
    }
  }

  openDocs = (e) => {
    e.stopPropagation();
    window.open('https://github.com/zalmoxisus/redux-devtools-extension/blob/master/docs/Features/Trace.md');
  }

  render() {
    const {stackFrames, showDocsLink} = this.state;

    if (showDocsLink) {
      return (
        <div style={rootStyle}>
          To enable tracing action calls, you should set `trace` option to `true` for Redux DevTools enhancer.
          Refer to <a href="#" onClick={this.openDocs}>this page</a> for more details.
        </div>
      );
    }

    return (
          <div style={rootStyle}>
              <StackTrace
                  stackFrames={stackFrames}
                  errorName={"N/A"}
                  contextSize={3}
                  editorHandler={this.onStackLocationClicked}
              />
          </div>
        );
  }
}
