import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import instrument from './instrument';

export default function createDevTools(children) {
  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;
  const ConnectedMonitor = connect(state => state)(Monitor);

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object
    };

    static propTypes = {
      store: PropTypes.object
    };

    static instrument = (options) => instrument(
      (state, action) => Monitor.update(monitorProps, state, action),
      options
    );

    constructor(props, context) {
      super(props, context);

      if (!props.store && !context.store) {
        console.error(
          'Redux DevTools could not render. You must pass the Redux store ' +
          'to <DevTools> either as a "store" prop or by wrapping it in a ' +
          '<Provider store={store}>.'
        );
        return;
      }

      if (context.store) {
        this.liftedStore = context.store.liftedStore;
      } else {
        this.liftedStore = props.store.liftedStore;
      }

      if (!this.liftedStore) {
        console.error(
          'Redux DevTools could not render. Did you forget to include ' +
          'DevTools.instrument() in your store enhancer chain before ' +
          'using createStore()?'
        );
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
