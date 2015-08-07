import React from 'react';
import reactMixin from 'react-mixin';
import { ExpandedStateHandlerMixin } from './mixins';
import JSONArrow from './JSONArrow';
import grabNode from './grab-node';

const styles = {
  base: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingRight: 4,
    letterSpacing: 1,
    marginLeft: 10
  },
  label: {
    margin: 0,
    padding: 0,
    display: 'inline-block',
    color: '#8fa1b2'
  },
  span: {
    color: '#049977',
    fontSize: 12,
    cursor: 'default'
  },
  spanExpanded: {
    color: '#D7D5D8'
  },
  spanType: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: 16
  }
};

@reactMixin.decorate(ExpandedStateHandlerMixin)
export default class JSONObjectNode extends React.Component {
  defaultProps = {
    data: [],
    initialExpanded: false
  };
  // cache store for the number of items string we display
  itemString = false;

  // flag to see if we still need to render our child nodes
  needsChildNodes = true;

  // cache store for our child nodes
  renderedChildren = [];

  constructor(props) {
    super(props);
    this.state = {
      expanded: this.props.initialExpanded,
      createdChildNodes: false
    };
  }

  // Returns the child nodes for each element in the object. If we have
  // generated them previously, we return from cache, otherwise we create
  // them.
  getChildNodes() {
    if (this.state.expanded && this.needsChildNodes) {
      const obj = this.props.data;
      let childNodes = [];
      for (let k in obj) {
        if (obj.hasOwnProperty(k)) {
          childNodes.push(grabNode(k, obj[k]));
        }
      }
      this.needsChildNodes = false;
      this.renderedChildren = childNodes;
    }
    return this.renderedChildren;
  }

  // Returns the "n Items" string for this node, generating and
  // caching it if it hasn't been created yet.
  getItemString() {
    if (!this.itemString) {
      const len = Object.keys(this.props.data).length;
      this.itemString = len + ' Item' + (len > 1 ? 's' : '');
    }
    return this.itemString;
  }

  render() {
    let childListStyle = {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      display: (this.state.expanded) ? 'block' : 'none'
    };
    let containerStyle = {...styles.base, ...styles.parentNode};
    let spanStyle = { ...styles.span };
    if (this.state.expanded) {
      spanStyle = {
        ...spanStyle,
        ...styles.spanExpanded
      };
    }
    return (
      <li style={containerStyle} onClick={::this.handleClick}>
        <JSONArrow open={this.state.expanded}/>
        <label style={styles.label}>{this.props.keyName}:</label>
        <span style={spanStyle}>
          <span style={styles.spanType}>&#123;&#125;</span>
          {this.getItemString()}
        </span>
        <ul style={childListStyle}>
          {this.getChildNodes()}
        </ul>
      </li>
    );
  }
}
