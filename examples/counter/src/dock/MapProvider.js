//
// TODO: extract to a separate project.
//

import React, { Children, Component, PropTypes } from 'react';

const identity = _ => _;
function mapStore(store, { mapAction = identity, mapState = identity }) {
  return {
    ...store,
    dispatch(action) {
      return store.dispatch(mapAction(action));
    },
    subscribe(listener) {
      return store.subscribe(listener);
    },
    getState() {
      return mapState(store.getState());
    }
  };
}

export default class MapProvider extends Component {
  static propTypes = {
    mapAction: PropTypes.func,
    mapState: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  static childContextTypes = {
    store: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      store: this.store
    };
  }

  constructor(props, context) {
    super(props, context);
    this.store = mapStore(context.store, props);
  }

  render() {
    return Children.only(this.props.children);
  }
}

