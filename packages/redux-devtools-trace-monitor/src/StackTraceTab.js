import React, { Component, PropTypes } from 'react';

import {getStackFrames} from './react-error-overlay/utils/getStackFrames';
import StackTrace from './react-error-overlay/containers/StackTrace';

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
      this.setState({stackFrames: []});
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
        const adjustedLineNumber = Math.max(lineNumber - 1, 0);


        chrome.devtools.panels.openResource(fileName, adjustedLineNumber, (result) => {
          //console.log("openResource callback args: ", callbackArgs);
          //console.log("Testing");
          if(result.isError) {
            const {fileName: finalFileName, lineNumber: finalLineNumber} = matchingStackFrame;
            const adjustedLineNumber = Math.max(finalLineNumber - 1, 0);
            chrome.devtools.panels.openResource(finalFileName, adjustedLineNumber, (result) => {
            // console.log("openResource result: ", result);
            });
          }
        });
      }
    }

  }


  render() {
    const {stackFrames} = this.state;

    return (
            <div style={{backgroundColor: 'white', color: 'black'}}>
                <h2>Dispatched Action Stack Trace</h2>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <StackTrace
                        stackFrames={stackFrames}
                        errorName={"N/A"}
                        contextSize={3}
                        editorHandler={this.onStackLocationClicked}
                    />
                </div>
            </div>
        );
  }
}
