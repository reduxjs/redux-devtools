import React, { Component } from 'react';
import { Action } from 'redux';
import { InspectorMonitor, Tab } from '@redux-devtools/inspector-monitor';
import { TraceTab } from '@redux-devtools/inspector-monitor-trace-tab';
import { TestTab } from '@redux-devtools/inspector-monitor-test-tab';
import { DATA_TYPE_KEY } from '../../../constants/dataTypes';
import SubTabs from './SubTabs';

const DEFAULT_TABS = [
  {
    name: 'Action',
    component: SubTabs,
  },
  {
    name: 'State',
    component: SubTabs,
  },
  {
    name: 'Diff',
    component: SubTabs,
  },
  {
    name: 'Trace',
    component: TraceTab,
  },
];

interface Features {
  test?: boolean;
  skip?: boolean;
}
interface Props {
  features?: Features;
}

class InspectorWrapper extends Component<Props> {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  static update = InspectorMonitor.update;

  render() {
    const { features, ...rest } = this.props;
    let tabs: () => Tab<unknown, Action<string>>[];
    if (features && features.test) {
      tabs = () => [
        ...(DEFAULT_TABS as Tab<unknown, Action<string>>[]),
        { name: 'Test', component: TestTab } as unknown as Tab<
          unknown,
          Action<string>
        >,
      ];
    } else {
      tabs = () => DEFAULT_TABS as Tab<unknown, Action<string>>[];
    }

    return (
      <InspectorMonitor
        dataTypeKey={DATA_TYPE_KEY}
        invertTheme={false}
        tabs={tabs}
        hideActionButtons={!features!.skip}
        hideMainButtons
        {...rest}
      />
    );
  }
}

export default InspectorWrapper;
