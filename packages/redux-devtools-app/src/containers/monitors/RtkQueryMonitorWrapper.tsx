import React, { Component } from 'react';
import { connect, ResolveThunks } from 'react-redux';
import RtkQueryInspectorMonitor from '@redux-devtools/rtk-query-inspector-monitor';
import { selectMonitorWithState } from '../../actions';

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class RtkQueryInspectorMonitorWrapper extends Component<Props> {
  static update = RtkQueryInspectorMonitor.update;

  render() {
    return (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      <RtkQueryInspectorMonitor defaultIsVisible invertTheme {...this.props} />
    );
  }
}

const actionCreators = {
  selectMonitorWithState: selectMonitorWithState,
};

export default connect(null, actionCreators)(RtkQueryInspectorMonitorWrapper);
