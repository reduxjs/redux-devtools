// ES6 + inline style port of JSONViewer https://bitbucket.org/davevedder/react-json-viewer/
// all credits and original code to the author
// Dave Vedder <veddermatic@gmail.com> http://www.eskimospy.com/
// port by Daniele Zannotti http://www.github.com/dzannotti <dzannotti@me.com>

import React from 'react';
import objectType from './obj-type';
import JSONObjectNode from './JSONObjectNode';
import JSONArrayNode from './JSONArrayNode';

const styles = {
    tree: {
      border: 0,
      padding: 0,
      marginTop: 8,
      marginBottom: 8,
      marginLeft: 2,
      marginRight: 0,
      fontSize: '0.90em',
      listStyle: 'none',
      MozUserSelect: 'none',
      WebkitUserSelect: 'none'
    }
};

export default class JSONTree extends React.Component {
  static propTypes = {
    data: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]).isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const nodeType = objectType(this.props.data);
    let rootNode = false;
    const keyName = this.props.keyName || 'root';
    if (nodeType === 'Object') {
      rootNode = <JSONObjectNode theme={this.props.theme} data={this.props.data} previousData={this.props.previousData} keyName={keyName} initialExpanded={true} />;
    } else if (nodeType === 'Array') {
      rootNode = <JSONArrayNode theme={this.props.theme} data={this.props.data} previousData={this.props.previousData} initialExpanded={true} keyName={keyName} />;
    }
    return (
      <ul style={{
        ...styles.tree,
        ...this.props.style
      }}>
        {rootNode}
      </ul>
    );
  }
}
