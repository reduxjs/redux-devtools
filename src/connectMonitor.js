import { bindActionCreators } from 'redux';
import bindActionCreatorsDeep from './bindActionCreatorsDeep';
import { connect } from 'react-redux';
import { ActionCreators as historyActionCreators } from './instrument';

export default function connectMonitor({
  component,
  reducer = () => null,
  actionCreators = {}
}) {
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

  const Monitor = connect(mapStateToProps, mapDispatchToProps)(component);
  Monitor.reducer = reducer;
  return Monitor;
}
