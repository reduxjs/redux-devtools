import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import instrument from './instrument';

export default function createDevTools(children) {
  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const ConnectedMonitor = connect(state => state)(Monitor);
  const enhancer = instrument((state, action) =>
    Monitor.reducer(state, action, monitorProps)
  );

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static instrument = () => enhancer;

    constructor(props, context) {
      super(props, context);
      this.liftedStore = context.store.liftedStore;
    }

    render() {
      return (
        <ConnectedMonitor {...monitorProps}
                          store={this.liftedStore} />
      );
    }
  };
}

