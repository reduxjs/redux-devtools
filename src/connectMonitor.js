import { bindActionCreators } from 'redux';
import bindActionCreatorsRecursively from './bindActionCreatorsRecursively';
import { connect } from 'react-redux';
import { ActionCreators as devToolsActionCreators } from './enhance';

export default function connectMonitor({
  component,
  reducer = () => null,
  actionCreators = {}
}) {
  function mapStateToProps(state) {
    return {
      devToolsState: state.devToolsState,
      monitorState: state.monitorState
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      devToolsActions: bindActionCreators(devToolsActionCreators, dispatch),
      monitorActions: bindActionCreatorsRecursively(actionCreators, dispatch)
    };
  }

  const Monitor = connect(mapStateToProps, mapDispatchToProps)(component);
  Monitor.reducer = reducer;
  return Monitor;
}
