import React, { Component, PropTypes } from 'react';
import InspectorMonitor from 'remotedev-inspector-monitor';
import StackTraceTab from './StackTraceTab';
import { DATA_TYPE_KEY } from '../../../constants/dataTypes';
import SubTabs from './SubTabs';
import TestTab from './TestTab';

const DEFAULT_TABS = [{
  name: 'Action',
  component: SubTabs
}, {
  name: 'State',
  component: SubTabs
}, {
  name: 'Diff',
  component: SubTabs
}];

const NON_INIT_TABS = [
  { name: 'Trace', component: StackTraceTab }
];

class InspectorWrapper extends Component {
  static update = InspectorMonitor.update;

  render() {
    const { lib, ...rest } = this.props;
    console.log(rest);
    let tabs;
    if (lib === 'redux') {
      tabs = () => [
        ...DEFAULT_TABS,
        ...(!rest.monitorState || rest.monitorState.selectedActionId === null ? NON_INIT_TABS : []),
        { name: 'Test', component: TestTab }
      ];
    } else {
      tabs = () => DEFAULT_TABS;
    }

    return (
      <InspectorMonitor
        dataTypeKey={DATA_TYPE_KEY}
        shouldPersistState={false}
        invertTheme={false}
        theme="nicinabox"
        tabs={tabs}
        {...rest}
      />
    );
  }
}

InspectorWrapper.propTypes = {
  lib: PropTypes.string
};

export default InspectorWrapper;
