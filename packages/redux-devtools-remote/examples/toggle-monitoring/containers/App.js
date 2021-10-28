import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter';
import * as MonitorActions from '../actions/monitoring';

function mapStateToProps(state) {
  return {
    counter: state.counter
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...CounterActions, ...MonitorActions }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
