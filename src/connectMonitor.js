import { connect } from 'react-redux';
import { ActionCreators } from './devTools';

export default function connectMonitor(Monitor) {
  return connect(state => state, ActionCreators)(Monitor);
}
