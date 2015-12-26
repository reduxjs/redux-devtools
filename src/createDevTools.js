import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import instrument from './instrument';

export default function createDevTools(children) {
  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const ConnectedMonitor = connect(state => state)(Monitor);
  const enhancer = instrument((state, action) =>
    Monitor.update(monitorProps, state, action)
  );

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object
    };

    static propTypes = {
      store: PropTypes.object
    };

    static instrument = () => enhancer;

    constructor(props, context) {
      super(props, context);

      if (!props.store && !context.store) {
        console.error(
`DevTools cannot render because no Redux store was injected via \
props or <Provide>`);
        return;
      }

      if (context.store) {
        this.liftedStore = context.store.liftedStore;
      } else {
        this.liftedStore = props.store.liftedStore;
      }

      if (!this.liftedStore) {
        console.error(
`DevTools cannot render because the store not been instrumented \
with DevTools.instrument()`);
      }
    }

    render() {
      if (!this.liftedStore) {
        return null;
      }

      return (
        <ConnectedMonitor {...monitorProps}
                          store={this.liftedStore} />
      );
    }
  };
}
