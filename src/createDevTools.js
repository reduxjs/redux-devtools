import React, { Children, Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import bindActionCreatorsDeep from './bindActionCreatorsDeep';
import instrument, { ActionCreators as historyActionCreators } from './instrument';

export default function createDevTools(children) {
  const child = Children.only(children);
  const { type: Monitor } = child;
  const { reducer, actionCreators } = Monitor.setup(child.props);

  function mapStateToProps(state) {
    return {
      historyState: state.historyState,
      monitorState: state.monitorState
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      historyActions: bindActionCreators(historyActionCreators, dispatch),
      monitorActions: bindActionCreatorsDeep(actionCreators, dispatch)
    };
  }

  const ConnectedMonitor = connect(
    mapStateToProps,
    mapDispatchToProps
  )(Monitor);

  return class DevTools extends Component {
    static contextTypes = {
      store: PropTypes.object.isRequired
    };

    static instrument = () => instrument(reducer);

    constructor(props, context) {
      super(props, context);
      this.instrumentedStore = context.store.instrumentedStore;
    }

    render() {
      return (
        <ConnectedMonitor {...child.props}
                          store={this.instrumentedStore} />
      );
    }
  };
}

