export default {
  handleClick(e) {
    e.stopPropagation();
    this.setState({
      expanded: !this.state.expanded
    });
  },

  componentWillReceiveProps() {
    // resets our caches and flags we need to build child nodes again
    this.renderedChildren = [];
    this.itemString = false;
    this.needsChildNodes = true;
  }
};
