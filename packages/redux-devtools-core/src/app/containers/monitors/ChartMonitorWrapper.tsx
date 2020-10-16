import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect, ResolveThunks } from 'react-redux';
import ChartMonitor from 'redux-devtools-chart-monitor';
import { selectMonitorWithState } from '../../actions';

export function getPath(obj, inspectedStatePath) {
  const parent = obj.parent;
  if (!parent) return;
  getPath(parent, inspectedStatePath);
  let name = obj.name;
  const item = name.match(/.+\[(\d+)]/);
  if (item) name = item[1];
  inspectedStatePath.push(name);
}

type DispatchProps = ResolveThunks<typeof actionCreators>;
type Props = DispatchProps;

class ChartMonitorWrapper extends Component<Props> {
  static update = ChartMonitor.update;

  onClickText = (data) => {
    const inspectedStatePath = [];
    getPath(data, inspectedStatePath);
    this.props.selectMonitorWithState('InspectorMonitor', {
      inspectedStatePath,
      tabName: 'State',
      subTabName: data.children ? 'Chart' : 'Tree',
      selectedActionId: null,
      startActionId: null,
      inspectedActionPath: [],
    });
  };

  render() {
    return (
      <ChartMonitor
        defaultIsVisible
        invertTheme
        onClickText={this.onClickText}
        {...this.props}
      />
    );
  }
}

ChartMonitorWrapper.propTypes = {
  selectMonitorWithState: PropTypes.func.isRequired,
};

const actionCreators = {
  selectMonitorWithState: selectMonitorWithState,
};

export default connect(null, actionCreators)(ChartMonitorWrapper);
