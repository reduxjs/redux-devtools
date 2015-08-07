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
    display: 'inline-block'
  },
  span: {
    fontSize: '0.85em',
    cursor: 'default'
  },
  spanType: {
    marginLeft: 5,
    marginRight: 5,
    fontSize: '1em'
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
          let prevData;
          if (typeof this.props.previousData !== 'undefined') {
            prevData = this.props.previousData[k];
          }
          childNodes.push(grabNode(k, obj[k], prevData, this.props.theme));
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
    console.log('render');
    let childListStyle = {
      padding: 0,
      margin: 0,
      listStyle: 'none',
      display: (this.state.expanded) ? 'block' : 'none'
    };
    let containerStyle;
    let spanStyle = {
      ...styles.span,
      color: this.props.theme.base0B
    };
    containerStyle = {
      ...styles.base,
      ...styles.parentNode
    };
    if (this.state.expanded) {
      spanStyle = {
        ...spanStyle,
        color: this.props.theme.base05
      };
    }
    return (
      <li style={containerStyle} onClick={::this.handleClick}>
        <JSONArrow theme={this.props.theme} open={this.state.expanded}/>
        <label style={{
          ...styles.label,
          color: this.props.theme.base0D
        }}>
          {this.props.keyName}:
        </label>
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
