import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import instrument from './instrument';

export default function createDevTools(children) {
  const monitorElement = Children.only(children);
  const monitorProps = monitorElement.props;
  const Monitor = monitorElement.type;

  const enhancer = instrument((state, action) =>
    Monitor.reducer(state, action, monitorProps)
  );

  function mapStateToProps(state) {
    return {
      ...state.historyState,
      monitorState: state.monitorState
    };
  }
  const ConnectedMonitor = connect(mapStateToProps)(Monitor);

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static instrument = () => enhancer;

    constructor(props, context) {
      super(props, context);
      this.instrumentedStore = context.store.instrumentedStore;
    }

    render() {
      return (
        <ConnectedMonitor {...monitorProps}
                          store={this.instrumentedStore} />
      );
    }
  };
}

