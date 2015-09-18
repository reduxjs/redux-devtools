import React, { PropTypes, findDOMNode, Component } from 'react';

const EXPORT_CONTAINER_HEIGHT = 150;
const ELEMENTS_CONTAINER_TOP = 38;

var styles = {
  exportContainer: {
    width: '100%',
    height: EXPORT_CONTAINER_HEIGHT
  },
  exportArea: {
    position: 'relative',
    resize: 'none',
    width: '100%',
    height: 112,
    backgroundColor: '#4F5A66',
    color: 'white'
  }
};

export default class LogMonitorTextarea extends Component {
  constructor(props) {
    super(props);
  }

  parseInput(event) {
    try {
      this.props.handleImport(JSON.parse(event.target.value))
    } catch(err) {
      console.warn('There was an error parsing the new state. Please enter a valid schema.');
    }
  }

  render() {
    let { handleImport, currentState, theme } = this.props;
    return currentState.monitorState.exportMode ? (
      <div style={{...styles.exportContainer, backgroundColor: theme.base00}}>
        <textarea style={styles.exportArea} value={JSON.stringify(currentState)} onChange={::this.parseInput} />
      </div>
    ) : null;
  }
}
